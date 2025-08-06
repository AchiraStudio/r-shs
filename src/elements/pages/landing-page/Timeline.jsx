import { useEffect, useRef, useState } from 'react';
import timelineData from '../../json/timelineData.json';
import '../css/timeline.css';

function Timeline() {
  const [activeIndex, setActiveIndex] = useState(
    timelineData.findIndex(event => event.active) || 0
  );
  const containerRef = useRef(null);
  const itemsRef = useRef([]);

  // Auto-scroll to active item on load
  useEffect(() => {
    if (itemsRef.current[activeIndex]) {
      itemsRef.current[activeIndex].scrollIntoView({
        behavior: 'auto',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setActiveIndex(prev => Math.min(prev + 1, timelineData.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex(prev => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle scroll to update active index
  const handleScroll = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollCenter = container.scrollLeft + container.clientWidth / 2;
    
    itemsRef.current.forEach((item, index) => {
      const itemCenter = item.offsetLeft + item.clientWidth / 2;
      if (Math.abs(itemCenter - scrollCenter) < item.clientWidth / 2) {
        setActiveIndex(index);
      }
    });
  };

  const scrollToItem = (index) => {
    setActiveIndex(index);
    itemsRef.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  };

  return (
    <section className="timeline-section" id="timeline">
      <div className="timeline-header">
        <h2 className="timeline-title">Our Journey</h2>
        <div className="timeline-header-line"></div>
      </div>

      <div className="timeline-container">
        <div 
          className="timeline-scroll"
          ref={containerRef}
          onScroll={handleScroll}
        >
          <div className="timeline-track">
            {timelineData.map((event, index) => (
              <article
                key={event.id}
                ref={el => itemsRef.current[index] = el}
                className={`timeline-item ${index === activeIndex ? 'active' : ''}`}
                style={{ '--event-color': event.color }}
                onClick={() => scrollToItem(index)}
                tabIndex={0}
              >
                <div className="timeline-item-marker">
                  <div className="timeline-item-icon">
                    <i className={event.icon} />
                  </div>
                  <div className="timeline-item-line"></div>
                </div>
                <div className="timeline-item-content">
                  <time className="timeline-item-date">{event.date}</time>
                  <h3 className="timeline-item-title">{event.title}</h3>
                  <p className="timeline-item-desc">{event.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="timeline-nav">
          <button 
            className="timeline-nav-button"
            onClick={() => scrollToItem(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous event"
          >
            ←
          </button>
          <div className="timeline-dots">
            {timelineData.map((_, index) => (
              <button
                key={index}
                className={`timeline-dot ${index === activeIndex ? 'active' : ''}`}
                onClick={() => scrollToItem(index)}
                aria-label={`Go to event ${index + 1}`}
              />
            ))}
          </div>
          <button 
            className="timeline-nav-button"
            onClick={() => scrollToItem(activeIndex + 1)}
            disabled={activeIndex === timelineData.length - 1}
            aria-label="Next event"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}

export default Timeline;