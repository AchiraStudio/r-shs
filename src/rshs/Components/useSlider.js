// hooks/useSlider.js
import { useState, useCallback, useEffect } from 'react';

export const useSlider = (slidesCount, autoPlay = false, interval = 5000) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideHistory, setSlideHistory] = useState([0]); // Track slide navigation history
  const [activeOverride, setActiveOverride] = useState(null); // For manual active slide selection

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

  // Go to main slide (slide 0)
  const goToMainSlide = useCallback(() => {
    goToSlide(0);
    setActiveOverride(null);
  }, [goToSlide]);

  // Set active slide override
  const setActiveSlide = useCallback((index) => {
    if (index === 0) {
      goToMainSlide();
    } else {
      setActiveOverride(index);
      goToSlide(index, false);
    }
  }, [goToSlide, goToMainSlide]);

  // Navigate through previous events (excluding main and current active)
  const navigatePreviousEvents = useCallback((direction = 'next') => {
    const previousEvents = Array.from({ length: slidesCount - 2 }, (_, i) => i + 1);
    const currentIndex = previousEvents.indexOf(currentSlide);
    
    if (currentIndex === -1) return;
    
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % previousEvents.length;
    } else {
      nextIndex = (currentIndex - 1 + previousEvents.length) % previousEvents.length;
    }
    
    const nextSlideIndex = previousEvents[nextIndex];
    goToSlide(nextSlideIndex, false);
  }, [currentSlide, slidesCount, goToSlide]);

  // Get available previous events based on current state
  const getAvailablePreviousEvents = useCallback(() => {
    if (currentSlide === 0) {
      // When on main slide, all non-zero slides are previous events
      return Array.from({ length: slidesCount - 1 }, (_, i) => i + 1);
    } else {
      // When on a previous event, show other previous events excluding current
      return Array.from({ length: slidesCount - 1 }, (_, i) => i + 1)
        .filter(slide => slide !== currentSlide);
    }
  }, [currentSlide, slidesCount]);

  // Auto-play functionality
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
    goToSlide,
    nextSlide,
    prevSlide,
    goToMainSlide,
    setActiveSlide,
    navigatePreviousEvents,
    getAvailablePreviousEvents
  };
};