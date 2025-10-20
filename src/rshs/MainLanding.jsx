import { useState, useCallback, useEffect, createContext, useContext, useRef } from 'react';
import './MainLanding.css';
import { Slide1, Slide5 } from './Components/Slides';

// Custom Hook with both normal sliding and special navigation
const useSlider = (slidesCount, autoPlay = false, interval = 5000) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideHistory, setSlideHistory] = useState([0]);
  const [activeOverride, setActiveOverride] = useState(null);
  const [mainSlide, setMainSlide] = useState(0);
  const [activeSlide, setActiveSlideState] = useState(1);

  const goToSlide = useCallback((index, addToHistory = true) => {
    if (isTransitioning || index === currentSlide) return;
    
    setIsTransitioning(true);
    
    if (addToHistory) {
      setSlideHistory(prev => [...prev, currentSlide]);
    }
    
    setCurrentSlide(index);
    
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, currentSlide]);

  const nextSlide = useCallback(() => {
    const next = (currentSlide + 1) % slidesCount;
    goToSlide(next);
  }, [currentSlide, slidesCount, goToSlide]);

  const prevSlide = useCallback(() => {
    const prev = (currentSlide - 1 + slidesCount) % slidesCount;
    goToSlide(prev);
  }, [currentSlide, slidesCount, goToSlide]);

  const goToMainSlide = useCallback(() => {
    goToSlide(mainSlide);
    setActiveOverride(null);
  }, [goToSlide, mainSlide]);

  const setActiveSlide = useCallback((index) => {
    if (index === mainSlide) {
      goToMainSlide();
    } else {
      setActiveSlideState(index);
      setActiveOverride(index);
      goToSlide(index, false);
    }
  }, [goToSlide, goToMainSlide, mainSlide]);

  const setMainSlideState = useCallback((index) => {
    setMainSlide(index);
    goToSlide(index);
    setActiveOverride(null);
  }, [goToSlide]);

  const navigatePreviousSlides = useCallback(() => {
    // Get all slides except main and active slides
    const previousSlides = Array.from({ length: slidesCount }, (_, i) => i)
      .filter(slide => slide !== mainSlide && slide !== activeSlide);
    
    if (previousSlides.length === 0) return;
    
    // Find current position in previous slides
    const currentIndex = previousSlides.indexOf(currentSlide);
    let nextIndex;
    
    if (currentIndex === -1) {
      // If current slide is not in previous slides, start from first
      nextIndex = 0;
    } else {
      // Move to next previous slide
      nextIndex = (currentIndex + 1) % previousSlides.length;
    }
    
    const nextSlideIndex = previousSlides[nextIndex];
    goToSlide(nextSlideIndex, false);
  }, [currentSlide, slidesCount, goToSlide, mainSlide, activeSlide]);

  const getAvailablePreviousSlides = useCallback(() => {
    return Array.from({ length: slidesCount }, (_, i) => i)
      .filter(slide => slide !== mainSlide && slide !== activeSlide);
  }, [slidesCount, mainSlide, activeSlide]);

  // Normal sequential navigation (for swiping)
  const goToSlideNormal = useCallback((index) => {
    if (isTransitioning || index === currentSlide) return;
    
    setIsTransitioning(true);
    setCurrentSlide(index);
    setActiveOverride(null); // Reset override when swiping
    
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, currentSlide]);

  const nextSlideNormal = useCallback(() => {
    const next = (currentSlide + 1) % slidesCount;
    goToSlideNormal(next);
  }, [currentSlide, slidesCount, goToSlideNormal]);

  const prevSlideNormal = useCallback(() => {
    const prev = (currentSlide - 1 + slidesCount) % slidesCount;
    goToSlideNormal(prev);
  }, [currentSlide, slidesCount, goToSlideNormal]);

  useEffect(() => {
    if (!autoPlay || activeOverride !== null) return;
    
    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, nextSlide, activeOverride]);

  return {
    currentSlide,
    isTransitioning,
    activeOverride,
    slideHistory,
    mainSlide,
    activeSlide,
    goToSlide,
    nextSlide,
    prevSlide,
    goToMainSlide,
    setActiveSlide,
    setMainSlideState,
    navigatePreviousSlides,
    getAvailablePreviousSlides,
    // Normal navigation methods
    nextSlideNormal,
    prevSlideNormal,
    goToSlideNormal
  };
};

// Context (export for use in DynamicIsland)
export const SliderContext = createContext();

export const SliderProvider = ({ children, value }) => {
  return (
    <SliderContext.Provider value={value}>
      {children}
    </SliderContext.Provider>
  );
};

// Slide Container Component
const SlideContainer = ({ children, isActive }) => {
  return (
    <div className={`slide ${isActive ? 'slide--active' : ''}`}>
      {children}
    </div>
  );
};

// Main Landing Component
const SLIDES_CONFIG = [
  { 
    id: 'main',
    component: Slide1,
    background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    type: 'main'
  },
  { 
    id: 'upcoming',
    component: Slide5,
    background: 'linear-gradient(135deg, #617B93, #80ABBB, #ECBFA2)',
    type: 'current'
  }
];

function Landing() {
  const slidesCount = SLIDES_CONFIG.length;
  const slider = useSlider(slidesCount, false, 5000);

  const sliderWithCount = {
    ...slider,
    slidesCount
  };

  // Update background when slide changes
  useEffect(() => {
    const currentConfig = SLIDES_CONFIG[slider.currentSlide];
    document.body.style.background = currentConfig.background;
    document.body.style.transition = 'background 0.8s ease';
  }, [slider.currentSlide]);

  // Enhanced swipe handling for normal sequential navigation
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      // Prevent default to avoid scrolling while swiping
      if (Math.abs(touchStartX - e.touches[0].clientX) > 10) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e) => {
      if (!touchStartX) return;
      
      touchEndX = e.changedTouches[0].clientX;
      touchEndY = e.changedTouches[0].clientY;
      
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;
      const threshold = 50;

      // Only register horizontal swipes with minimal vertical movement
      if (Math.abs(diffX) > threshold && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
          // Swipe left - next slide (normal sequential)
          slider.nextSlideNormal();
        } else {
          // Swipe right - previous slide (normal sequential)
          slider.prevSlideNormal();
        }
      }
      
      touchStartX = 0;
      touchStartY = 0;
    };

    // Mouse events for desktop testing
    let mouseStartX = 0;
    let mouseDown = false;

    const handleMouseDown = (e) => {
      mouseStartX = e.clientX;
      mouseDown = true;
    };

    const handleMouseMove = (e) => {
      if (!mouseDown) return;
      
      // Prevent text selection while dragging
      e.preventDefault();
    };

    const handleMouseUp = (e) => {
      if (!mouseDown) return;
      
      const diffX = mouseStartX - e.clientX;
      const threshold = 50;

      if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          slider.nextSlideNormal();
        } else {
          slider.prevSlideNormal();
        }
      }
      
      mouseDown = false;
    };

    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [slider]);

  // Set initial active slide (you can change this as needed)
  useEffect(() => {
    slider.setMainSlideState(0);
    slider.setActiveSlide(1);
  }, []);

  return (
    <SliderProvider value={sliderWithCount}>
      <section className="landing" id="landing">
        {/* Add Dynamic Island component */}
        
        <div className="slider-container">
          <div className="slider-track">
            {SLIDES_CONFIG.map((slideConfig, index) => {
              const SlideComponent = slideConfig.component;
              return (
                <SlideContainer 
                  key={slideConfig.id}
                  isActive={index === slider.currentSlide}
                >
                  <SlideComponent />
                </SlideContainer>
              );
            })}
          </div>
        </div>
      </section>
    </SliderProvider>
  );
}

export default Landing;