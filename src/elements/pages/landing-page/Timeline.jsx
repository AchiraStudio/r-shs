import { useEffect, useRef, useState } from 'react';
import timelineData from '../../json/timelineData.json';
import '../css/timeline.css';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

function Timeline() {
  const [activeIndex, setActiveIndex] = useState(
    timelineData.findIndex(event => event.active) || 0
  );
  const containerRef = useRef(null);
  const sliderRef = useRef(null);
  const itemsRef = useRef([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Update mouse position for glow effect
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Auto-scroll to active item on load and when activeIndex changes
  useEffect(() => {
    const scrollToActiveItem = () => {
      if (itemsRef.current[activeIndex]) {
        itemsRef.current[activeIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
      // Update slider position
      if (sliderRef.current) {
        const sliderWidth = sliderRef.current.offsetWidth;
        const thumbWidth = sliderWidth / timelineData.length;
        const newPosition = (activeIndex / (timelineData.length - 1)) * (sliderWidth - thumbWidth);
        sliderRef.current.style.setProperty('--slider-thumb-position', `${newPosition}px`);
      }
    };

    const timer = setTimeout(scrollToActiveItem, 100);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => Math.min(prev + 1, timelineData.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
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

  // Touch and mouse drag handling for timeline
  const startDrag = (e) => {
    setIsDragging(true);
    setStartX(e.pageX || e.touches[0].pageX);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const duringDrag = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX || e.touches[0].pageX;
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const endDrag = () => {
    setIsDragging(false);
  };

  // Handle slider navigation
  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value);
    setActiveIndex(value);
  };

  // Handle scroll to update active index
  const handleScroll = () => {
    if (!containerRef.current || isDragging) return;

    const container = containerRef.current;
    const scrollCenter = container.scrollLeft + container.clientWidth / 2;
    
    let closestIndex = 0;
    let smallestDistance = Infinity;
    
    itemsRef.current.forEach((item, index) => {
      if (!item) return;
      const itemCenter = item.offsetLeft + item.clientWidth / 2;
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

  // Focus management for accessibility
  const focusItem = (index) => {
    if (itemsRef.current[index]) {
      itemsRef.current[index].focus();
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
          onMouseDown={startDrag}
          onMouseMove={(e) => {
            handleMouseMove(e);
            duringDrag(e);
          }}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onTouchStart={startDrag}
          onTouchMove={duringDrag}
          onTouchEnd={endDrag}
          role="region"
          aria-label="Timeline events"
          tabIndex={0}
        >
          <div className="timeline-track">
            {timelineData.map((event, index) => (
              <article
                key={event.id}
                ref={el => itemsRef.current[index] = el}
                className={`timeline-item ${index === activeIndex ? 'active' : ''}`}
                style={{ 
                  '--event-color': event.color,
                  '--mouse-x': `${mousePos.x}px`,
                  '--mouse-y': `${mousePos.y}px`,
                  animationDelay: `${index * 0.1 + 0.1}s`
                }}
                onClick={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                tabIndex={index === activeIndex ? 0 : -1}
                role="article"
                aria-labelledby={`timeline-title-${index}`}
                aria-describedby={`timeline-desc-${index}`}
                aria-current={index === activeIndex ? 'step' : undefined}
              >
                <div className="timeline-item-marker" aria-hidden="true">
                  <div className="timeline-item-icon">
                    <i className={event.icon} aria-hidden="true" />
                  </div>
                  <div className="timeline-item-line"></div>
                </div>
                <div className="timeline-item-content">
                  <time className="timeline-item-date" dateTime={event.datetime || event.date}>
                    {event.date}
                  </time>
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
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="timeline-slider-container">
          <div className="timeline-slider-track">
            <input
              type="range"
              min="0"
              max={timelineData.length - 1}
              value={activeIndex}
              onChange={handleSliderChange}
              className="timeline-slider"
              ref={sliderRef}
              aria-label="Timeline navigation slider"
              style={{
                '--slider-thumb-position': '0px',
                '--slider-progress': `${(activeIndex / (timelineData.length - 1)) * 100}%`
              }}
            />
          </div>
          
          <div className="timeline-nav-buttons">
            <button 
              className="timeline-nav-button"
              onClick={() => setActiveIndex(prev => Math.max(prev - 1, 0))}
              disabled={activeIndex === 0}
              aria-label="Previous event"
            >
              <FaArrowLeft id="left_arrow" />
            </button>
            <button 
              className="timeline-nav-button"
              onClick={() => setActiveIndex(prev => Math.min(prev + 1, timelineData.length - 1))}
              disabled={activeIndex === timelineData.length - 1}
              aria-label="Next event"
            >
              <FaArrowRight id="right_arrow" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Timeline;