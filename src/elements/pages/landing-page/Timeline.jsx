import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import timelineData from '../../json/timelineData.json';
import '../css/timeline.css';

function Timeline() {
  const [activeIndex, setActiveIndex] = useState(
    timelineData.findIndex(event => event.active) || 0
  );
  const containerRef = useRef(null);
  const itemsRef = useRef([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);

  // Memoize timeline data to prevent unnecessary re-renders
  const memoizedTimelineData = useMemo(() => timelineData, []);

  // Scroll to active item when activeIndex changes
  useEffect(() => {
    if (!containerRef.current || !itemsRef.current[activeIndex]) return;
    
    // Prevent scroll event from triggering setActiveIndex
    setIsScrolling(true);
    
    const container = containerRef.current;
    const activeItem = itemsRef.current[activeIndex];
    
    // Calculate scroll position to center the active item
    const itemTop = activeItem.offsetTop;
    const itemHeight = activeItem.clientHeight;
    const containerHeight = container.clientHeight;
    const scrollPosition = itemTop - (containerHeight / 2) + (itemHeight / 2);
    
    container.scrollTo({
      top: scrollPosition,
      behavior: 'smooth'
    });
    
    // Reset isScrolling flag after animation completes
    const timeoutId = setTimeout(() => {
      setIsScrolling(false);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [activeIndex]);

  // Handle keyboard navigation with useCallback
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, memoizedTimelineData.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(memoizedTimelineData.length - 1);
    }
  }, [memoizedTimelineData]);

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Handle scroll to update active index with throttling
  const handleScroll = useCallback(() => {
    if (!containerRef.current || isScrolling) return;

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
  }, [activeIndex, isScrolling]);

  // Handle indicator click
  const handleIndicatorClick = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  // Handle dot click
  const handleDotClick = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  // Handle item click
  const handleItemClick = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  // Handle item hover
  const handleItemMouseEnter = useCallback((index) => {
    setHoveredIndex(index);
  }, []);

  const handleItemMouseLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  // Handle keyboard navigation for dots and items
  const handleKeyDownForItem = useCallback((e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveIndex(index);
    }
  }, []);

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
          tabIndex={0}
        >
          <div className="timeline-track">
            {memoizedTimelineData.map((event, index) => (
              <div
                key={event.id}
                className={`timeline-item-wrapper ${index % 2 === 0 ? 'left' : 'right'}`}
                ref={el => itemsRef.current[index] = el}
              >
                <div className="timeline-line" aria-hidden="true"></div>
                <div 
                  className={`timeline-dot ${index === activeIndex ? 'active' : ''}`}
                  style={{ '--event-color': event.color }}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to ${event.title}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => handleKeyDownForItem(e, index)}
                ></div>
                <article
                  className={`timeline-item ${index === activeIndex ? 'active' : ''} ${hoveredIndex === index ? 'hovered' : ''}`}
                  onClick={() => handleItemClick(index)}
                  onMouseEnter={() => handleItemMouseEnter(index)}
                  onMouseLeave={handleItemMouseLeave}
                  style={{ 
                    '--event-color': event.color,
                    animationDelay: `${index * 0.1}s`
                  }}
                  role="article"
                  aria-labelledby={`timeline-title-${index}`}
                  aria-describedby={`timeline-desc-${index}`}
                  aria-current={index === activeIndex ? 'step' : undefined}
                  tabIndex={0}
                  onKeyDown={(e) => handleKeyDownForItem(e, index)}
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
      </div>
    </section>
  );
}

export default Timeline;