import { useState, useEffect, useRef } from 'react';
import './slides.css';
import './slide-css/slide1.css';
import './slide-css/slide2.css';
import './slide-css/slide3.css';
import './slide-css/slide4.css';
import './slide-css/slide5.css';
import './slide-css/slide6.css';
import './slide-container.css';
import { Slide1, Slide2, Slide3, Slide4, Slide5, Slide6 } from './slides';

function SlideshowContainer() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6];
  const containerRef = useRef(null);
  const intervalRef = useRef(null);
  const isVisibleRef = useRef(true);

  // Check if slide is in viewport
  const checkVisibility = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      isVisibleRef.current = (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }
  };

  // Auto-advance slides
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (isVisibleRef.current) {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }
    }, 8000); // Change slide every 8 seconds when visible

    return () => {
      clearInterval(intervalRef.current);
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [slides.length]);

  return (
    <div className="slideshow-container" ref={containerRef}>
      {slides.map((SlideComponent, index) => (
        <div 
          key={index}
          className={`slide-wrapper ${index === currentSlide ? 'active' : ''}`}
          style={{ display: index === currentSlide ? 'block' : 'none' }}
        >
          <SlideComponent />
        </div>
      ))}
      
      {/* Navigation dots */}
      <div className="slide-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default SlideshowContainer;