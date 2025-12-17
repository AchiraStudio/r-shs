import React, { memo, useMemo, useCallback, lazy, Suspense } from 'react';
import './Slides.css';
import ImageCarousel from './ImageCarousel';
import './Slides-anim'
import './Slides-Pop.css';

// Lazy load non-critical components
const Timeline = lazy(() => import('../../elements/pages/landing-page/Timeline'));
const About = lazy(() => import('../../elements/pages/landing-page/About'));
const CrewSection = lazy(() => import('../../elements/pages/landing-page/Crew'));
const Footer = lazy(() => import('../../elements/pages/landing-page/Footer'));
const RandomQuote = lazy(() => import('../../elements/pages/landing-page/sliders/quotes'));

// Memoized particle components to prevent unnecessary re-renders
const Particle = memo(({ index }) => (
  <div 
    key={index} 
    className="particle"
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${2 + Math.random() * 3}s`
    }}
  />
));

const Snowflake = memo(({ index }) => (
  <div 
    key={index} 
    className="snowflake"
    style={{
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${5 + Math.random() * 10}s`,
      opacity: Math.random() * 0.6 + 0.4,
      fontSize: `${0.8 + Math.random() * 0.8}rem`
    }}
  >
    {['❄', '❅', '❆'][Math.floor(Math.random() * 3)]}
  </div>
));

const FloatingHeart = memo(({ index }) => (
  <div 
    key={index} 
    className="floating-heart"
    style={{
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${3 + Math.random() * 4}s`
    }}
  />
));

const EasterEgg = memo(({ index }) => (
  <div 
    key={index} 
    className="easter-egg"
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${3 + Math.random() * 4}s`
    }}
  />
));

const ConfettiPiece = memo(({ index }) => (
  <div 
    key={index} 
    className="confetti-piece"
    style={{
      left: `${Math.random() * 100}%`,
      backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${2 + Math.random() * 3}s`
    }}
  />
));

// Memoized slide components
const Slide1 = memo(() => {
  // Memoize particles array to prevent recreation on every render
  const particles = useMemo(() => [...Array(30)], []);
  
  return (
    <>
      <div className="slide-content slide-1 slide-modern">
        <div className="liquid-background">
          <div className="liquid-shape shape-1"></div>
          <div className="liquid-shape shape-2"></div>
          <div className="liquid-shape shape-3"></div>
          <div className="liquid-shape shape-4"></div>
          <div className="liquid-shape shape-5"></div>
        </div>
        
        <div className="particles-container">
          {particles.map((_, i) => <Particle key={i} index={i} />)}
        </div>
        
        <div className="glass-morphism">
          <div className="slide-container">
            <div className="content-wrapper">
              <div className="floating-elements">
                <div className="floating-card card-1"></div>
                <div className="floating-card card-2"></div>
                <div className="floating-card card-3"></div>
                <div className="floating-card card-4"></div>
                <div className="floating-card card-5"></div>
              </div>
              
              <div className="glowing-orb orb-1"></div>
              <div className="glowing-orb orb-2"></div>
              <div className="glowing-orb orb-3"></div>
              
              <h1 className="slide-title">
                <span className="title-line">Welcome to</span>
                <span className="title-line gradient-text">RSHS</span>
              </h1>
              
              {/* Fixed: Changed p to div to avoid nesting div inside p */}
              <div className="slide-subtitle quotes">
                <Suspense fallback={<div>Loading quote...</div>}>
                  <RandomQuote />
                </Suspense>
              </div>
              
              <div className="dynamic-grid">
                <div className="grid-item"></div>
                <div className="grid-item"></div>
                <div className="grid-item"></div>
                <div className="grid-item"></div>
                <div className="grid-item"></div>
                <div className="grid-item"></div>
              </div>
              
              <div className="feature-highlights">
                <div className="feature-item">
                  <div className="feature-icon">🎓</div>
                  <span>#43 secara Nasional</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🏆</div>
                  <span>#1 Sekolah terbaik Bogor</span>
                </div>
              </div>
            </div>
          </div>
          <div className="slide-container slide-container_two">
            <div className="image-container">
              <ImageCarousel></ImageCarousel>
            </div>
          </div>
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <Timeline />
        <About />
        <CrewSection />
        <Footer />
      </Suspense>
    </>
  );
});

export { Slide1 };