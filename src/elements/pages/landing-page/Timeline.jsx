import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import '../css/timeline.css';
import timelineData from '../../json/timelineData.json';

function Timeline() {
  const sliderRef = useRef(null);
  const cardRefs = useRef([]);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Find index of card with active: true
  const defaultActiveIndex = timelineData.findIndex(event => event.active === true);
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex !== -1 ? defaultActiveIndex : 0);

  // Scroll to active card on load
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && cardRefs.current[activeIndex]) {
          cardRefs.current[activeIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
            scrollMode: 'if-needed' // optional, safer fallback
          });
          observer.disconnect(); // Only trigger once
        }
      },
      {
        root: null,
        threshold: 0.1
      }
    );

    if (sliderRef.current) {
      observer.observe(sliderRef.current);
    }

    return () => observer.disconnect();
  }, [activeIndex]);

  // Update active index on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!sliderRef.current || cardRefs.current.length === 0) return;

      const scrollLeft = sliderRef.current.scrollLeft;
      const cardWidth = cardRefs.current[0]?.offsetWidth || 1;
      const newIndex = Math.round(scrollLeft / (cardWidth + 30)); // 30 = gap
      setActiveIndex((prev) => (prev !== newIndex ? newIndex : prev));
    };

    const slider = sliderRef.current;
    slider?.addEventListener('scroll', handleScroll);
    return () => slider?.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;

    if (diff > 30 && activeIndex < timelineData.length - 1) {
      scrollToCard(activeIndex + 1); // Swipe left
    } else if (diff < -30 && activeIndex > 0) {
      scrollToCard(activeIndex - 1); // Swipe right
    }
  };

  const scrollToCard = (index) => {
    if (cardRefs.current[index]) {
      cardRefs.current[index].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
      setActiveIndex(index);
    }
  };

  // Handle card click
  const handleCardClick = (index) => {
    scrollToCard(index);
  };

  return (
    <div className="timeline-slider-container" id='timeline'>
      <div className="timeline-header">
        <h2 className="timeline-title" data-text="Our Timeline">Our Timeline</h2>
        <div className="timeline-header-line"></div>
      </div>

      <div
        className="timeline-slider"
        ref={sliderRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="timeline-slider-track">
          {timelineData.map((event, index) => {
            const distance = Math.abs(index - activeIndex);
            const scale = Math.max(0.1, 1 - distance * 0.2);
            const blur = Math.min(distance * 2, 8);

            return (
              <div
                key={event.id}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`timeline-card timeline__event--${event.type} ${index === activeIndex ? 'active' : ''}`}
                role="article"
                aria-labelledby={`event-${event.id}-title`}
                style={{
                  transform: `scale(${scale})`,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease, background 0.5s ease',
                  background: event.color,
                  animation: `${event.animation?.type || 'none'} ${event.animation?.speed || '2s'} infinite alternate`,
                  '--active-color': event.animation?.activeColor || '#ffffff',
                  '--hover-glow-color': event.animation?.hoverEffect === 'glow' ? 'rgba(255,255,255,0.3)' : 'transparent'
                }}
                onClick={() => handleCardClick(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCardClick(index);
                  }
                }}
                tabIndex={0}
              >
                <div
                  className="timeline-card-overlay"
                  style={{
                    backdropFilter: `blur(${blur}px)`,
                    WebkitBackdropFilter: `blur(${blur}px)`,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                />
                <div className="timeline-card-date">{event.date}</div>
                <div 
                  className="timeline-card-icon"
                  style={{
                    backgroundImage: `url(${event.backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <i className={event.icon} aria-hidden="true" />
                </div>
                <div className="timeline-card-content">
                  <div id={`event-${event.id}-title`} className="timeline-card-title">
                    {event.title}
                  </div>
                  <div className="timeline-card-description">
                    <p>{event.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="timeline-dots">
        <button
          className="timeline-dot"
          onClick={() => scrollToCard(Math.max(activeIndex - 1, 0))}
          aria-label="Previous slide"
        >◀</button>

        <button
          className="timeline-dot"
          onClick={() => scrollToCard(Math.min(activeIndex + 1, timelineData.length - 1))}
          aria-label="Next slide"
        >▶</button>
      </div>
    </div>
  );
}

Timeline.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      icon: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['type1', 'type2', 'type3']).isRequired,
      active: PropTypes.bool,
      backgroundImage: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired
    })
  )
};

export default Timeline;