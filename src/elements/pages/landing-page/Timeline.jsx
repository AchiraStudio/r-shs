import { useEffect, useRef, useState } from 'react';
import timelineData from '../../json/timelineData.json';
import '../css/timeline.css';

function Timeline() {
  const [activeIndex, setActiveIndex] = useState(
    timelineData.findIndex(event => event.active) || 0
  );
  const containerRef = useRef(null);
  const itemsRef = useRef([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);


  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => Math.min(prev + 1, timelineData.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Home') {
        e.preventDefault();
        setActiveIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setActiveIndex(timelineData.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle scroll to update active index
  const handleScroll = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollCenter = container.scrollTop + container.clientHeight / 2;
    
    let closestIndex = 0;
    let smallestDistance = Infinity;
    
    itemsRef.current.forEach((item, index) => {
      if (!item) return;
      const itemCenter = item.offsetTop + item.clientHeight / 2;
      const distance = Math.abs(itemCenter - scrollCenter);
      
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestIndex = index;
      }
    });
    
    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
    }
  };

  return (
    <section className="timeline-section" id="timeline" aria-label="Company timeline">
      <div className="timeline-header">
        <h2 className="timeline-title">Our Journey</h2>
        <div className="timeline-header-line" aria-hidden="true"></div>
      </div>

      <div className="timeline-container">
        <div 
          className="timeline-scroll"
          ref={containerRef}
          onScroll={handleScroll}
          role="region"
          aria-label="Timeline events"
        >
          <div className="timeline-track">
            {timelineData.map((event, index) => (
              <div
                key={event.id}
                className={`timeline-item-wrapper ${index % 2 === 0 ? 'left' : 'right'}`}
                ref={el => itemsRef.current[index] = el}
              >
                <div className="timeline-line" aria-hidden="true"></div>
                <div 
                  className={`timeline-dot ${index === activeIndex ? 'active' : ''}`}
                  style={{ '--event-color': event.color }}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to ${event.title}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveIndex(index);
                    }
                  }}
                ></div>
                <article
                  className={`timeline-item ${index === activeIndex ? 'active' : ''} ${hoveredIndex === index ? 'hovered' : ''}`}
                  onClick={() => setActiveIndex(index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{ 
                    '--event-color': event.color,
                    animationDelay: `${index * 0.1}s`
                  }}
                  role="article"
                  aria-labelledby={`timeline-title-${index}`}
                  aria-describedby={`timeline-desc-${index}`}
                  aria-current={index === activeIndex ? 'step' : undefined}
                >
                  <div className="timeline-item-header">
                    <div className="timeline-item-icon">
                      <i className={event.icon} aria-hidden="true" />
                    </div>
                    <time className="timeline-item-date" dateTime={event.datetime || event.date}>
                      {event.date}
                    </time>
                  </div>
                  <h3 
                    className="timeline-item-title" 
                    id={`timeline-title-${index}`}
                  >
                    {event.title}
                  </h3>
                  <p 
                    className="timeline-item-desc" 
                    id={`timeline-desc-${index}`}
                  >
                    {event.description}
                  </p>
                </article>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="timeline-indicators">
          {timelineData.map((_, index) => (
            <button
              key={index}
              className={`timeline-indicator ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to event ${index + 1}`}
              style={{ '--event-color': timelineData[index].color }}
            />
          ))}
        </div> */}
      </div>
    </section>
  );
}

export default Timeline;