import { useState, useRef, useEffect, useCallback } from 'react';
import './css/valentine-cny.css';
import eventData from '../json/events.json';
import { FaPlay, FaPause, FaHeart, FaDragon, FaMusic } from "react-icons/fa";
import DynamicIsland from '../../rshs/Components/DynamicI';

const ValentineCNYEvent = () => {
  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // UI state
  const [activeSection, setActiveSection] = useState('landing');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Refs
  const audioRef = useRef(null);
  const landingRef = useRef(null);
  const aboutRef = useRef(null);
  const experienceRef = useRef(null);

  // Get event data from JSON
  const valentineCNYEvent = eventData.events.valentine;

  // Audio controls
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleProgressChange = useCallback((e) => {
    const value = Number(e.target.value);
    const newTime = (value / 100) * duration;
    if (audioRef.current) audioRef.current.currentTime = newTime;
    setProgress(value);
  }, [duration]);

  const formatTime = useCallback((time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, []);

  // Scroll progress and section detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight - windowHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);

      // Section detection
      const sections = [landingRef, aboutRef, experienceRef];
      const current = sections.findIndex(ref => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          return rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2;
        }
        return false;
      });
      
      if (current !== -1) {
        setActiveSection(['landing', 'about', 'experience'][current]);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      if (duration > 0) {
        setProgress((audio.currentTime / duration) * 100);
      }
    };

    const setAudioData = () => {
      setDuration(audio.duration || 0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', setAudioData);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', setAudioData);
    };
  }, [duration]);

  // Floating elements effect
  const renderFloatingElements = () => {
    const elements = [];
    const symbols = ['❤️', '🏮', '✨', '🥠', '💝', '🐉'];
    
    for (let i = 0; i < 20; i++) {
      const style = {
        left: `${Math.random() * 100}%`,
        animationDuration: `${20 + Math.random() * 25}s`,
        animationDelay: `${Math.random() * 15}s`,
        fontSize: `${Math.random() * 20 + 12}px`,
      };
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      
      elements.push(
        <div key={i} className="floating-element" style={style}>
          {symbol}
        </div>
      );
    }
    return elements;
  };

  const scrollToSection = (section) => {
    const sections = {
      landing: landingRef,
      about: aboutRef,
      experience: experienceRef
    };
    sections[section]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
    <DynamicIsland></DynamicIsland>
      {/* Progress Bar */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }}></div>

      <div className="valentine-cny-event">
        {/* Floating Background Elements */}
        <div className="floating-background">
          {renderFloatingElements()}
        </div>


        {/* Landing Section */}
        <section ref={landingRef} className="landing-section">
          <div className="landing-content">
            <div className="title-container">
              <div className="cultural-symbols">
                <div className="symbol-left">🐉</div>
                <div className="symbol-right">❤️</div>
              </div>
              
              <h1 className="main-title">
                <span className="title-line">Slither</span>
                <span className="title-line accent">Sweetheart</span>
              </h1>
              
              <div className="subtitle-container">
                <p className="event-subtitle">Where Ancient Tradition Meets Eternal Love</p>
                <div className="title-decoration">
                  <FaDragon className="decoration-icon" />
                  <FaHeart className="decoration-icon" />
                  <FaMusic className="decoration-icon" />
                </div>
              </div>
            </div>

            <div className="cta-container">
              <button 
                className="cta-button primary"
                onClick={() => scrollToSection('experience')}
              >
                <span>Enter the Celebration</span>
                <div className="button-sparkle"></div>
              </button>
              
              <div className="audio-player-mini">
                <button
                  className={`play-btn-mini ${isPlaying ? 'playing' : ''}`}
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause music' : 'Play music'}
                >
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <div className="track-info">
                  <span className="track-title">Harmony of Love & Prosperity</span>
                  <div className="mini-progress">
                    <div 
                      className="mini-progress-bar" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="scroll-indicator">
              <div className="scroll-arrow"></div>
              <span>Discover the Fusion</span>
            </div>
          </div>

          {/* Background Ornaments */}
          <div className="landing-ornaments">
            <div className="ornament chinese-pattern"></div>
            <div className="ornament heart-pattern"></div>
            <div className="ornament gold-dust"></div>
          </div>
        </section>

        {/* About Section */}
        <section ref={aboutRef} className="about-section">
          <div className="section-container">
            <div className="section-header">
              <h2 className="section-title">
                <span className="title-accent">Cultural</span>
                Fusion
              </h2>
              <div className="section-divider">
                <span className="divider-symbol">❤️</span>
                <span className="divider-symbol">🏮</span>
                <span className="divider-symbol">🐉</span>
              </div>
            </div>

            <div className="about-content">
              <div className="cultural-blend">
                <div className="culture-card valentine">
                  <div className="culture-icon">
                    <FaHeart />
                  </div>
                  <h3>Valentine's Essence</h3>
                  <p>Romance, affection, and the celebration of love in its purest form</p>
                  <div className="culture-features">
                    <span>❤️ Eternal Love</span>
                    <span>💝 Heartfelt Moments</span>
                    <span>✨ Romantic Magic</span>
                  </div>
                </div>

                <div className="fusion-symbol">
                  <div className="fusion-circle">
                    <span>⚭</span>
                  </div>
                </div>

                <div className="culture-card cny">
                  <div className="culture-icon">
                    <FaDragon />
                  </div>
                  <h3>Lunar New Year</h3>
                  <p>Prosperity, family bonds, and the awakening of the mighty dragon</p>
                  <div className="culture-features">
                    <span>🏮 Abundant Fortune</span>
                    <span>🐉 Dragon's Power</span>
                    <span>🎊 Family Unity</span>
                  </div>
                </div>
              </div>

              <div className="fusion-story">
                <h3>The Harmony of Two Celebrations</h3>
                <p>
                  This unique event blends the passionate romance of Valentine's Day with the 
                  prosperous energy of Chinese New Year. Experience the perfect harmony where 
                  red envelopes meet love letters, and dragon dances intertwine with romantic melodies.
                </p>
                <div className="fusion-stats">
                  <div className="fusion-stat">
                    <span className="stat-number">2</span>
                    <span className="stat-label">Cultures</span>
                  </div>
                  <div className="fusion-stat">
                    <span className="stat-number">1</span>
                    <span className="stat-label">Harmony</span>
                  </div>
                  <div className="fusion-stat">
                    <span className="stat-number">∞</span>
                    <span className="stat-label">Memories</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section ref={experienceRef} className="experience-section">
          <div className="section-container">
            <div className="section-header">
              <h2 className="section-title">
                Immersive
                <span className="title-accent"> Experience</span>
              </h2>
              <div className="section-divider">
                <span className="divider-symbol">💫</span>
                <span className="divider-symbol">🎵</span>
                <span className="divider-symbol">🌹</span>
              </div>
            </div>

            <div className="experience-content">
              <div className="experience-grid">
                <div className="experience-card audio-experience">
                  <div className="card-header">
                    <FaMusic className="card-icon" />
                    <h3>Musical Harmony</h3>
                  </div>
                  <div className="card-content">
                    <p>Blended melodies of romantic ballads and traditional Chinese instruments</p>
                    
                    <div className="audio-player-full">
                      <div className="player-header">
                        <span className="track-name">Dragon's Love Symphony</span>
                        <span className="time-display">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>
                      
                      <div className="progress-container-full">
                        <input
                          type="range"
                          className="progress-bar-full"
                          value={progress}
                          min={0}
                          max={100}
                          step={0.1}
                          onChange={handleProgressChange}
                          style={{ '--progress': `${progress}%` }}
                        />
                      </div>
                      
                      <div className="player-controls-full">
                        <button
                          className={`control-btn-full play-btn-full ${isPlaying ? 'playing' : ''}`}
                          onClick={togglePlay}
                        >
                          {isPlaying ? <FaPause /> : <FaPlay />}
                          <span>{isPlaying ? 'Pause Harmony' : 'Play Harmony'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="card-glow"></div>
                </div>

                <div className="experience-card visual-experience">
                  <div className="card-header">
                    <FaHeart className="card-icon" />
                    <h3>Visual Poetry</h3>
                  </div>
                  <div className="card-content">
                    <p>Floating lanterns dance with hearts in an elegant visual symphony</p>
                    <div className="visual-demo">
                      <div className="floating-heart"></div>
                      <div className="floating-lantern"></div>
                      <div className="gold-sparkle"></div>
                    </div>
                  </div>
                </div>

                <div className="experience-card cultural-experience">
                  <div className="card-header">
                    <FaDragon className="card-icon" />
                    <h3>Cultural Elements</h3>
                  </div>
                  <div className="card-content">
                    <p>Discover the symbolic fusion of romantic and prosperous traditions</p>
                    <div className="cultural-elements">
                      <div className="cultural-item">
                        <span className="element-icon">❤️</span>
                        <span>Love Letters</span>
                      </div>
                      <div className="cultural-item">
                        <span className="element-icon">🏮</span>
                        <span>Red Lanterns</span>
                      </div>
                      <div className="cultural-item">
                        <span className="element-icon">🐉</span>
                        <span>Dragon Energy</span>
                      </div>
                      <div className="cultural-item">
                        <span className="element-icon">💝</span>
                        <span>Romantic Gifts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="interactive-cta">
                <div className="cta-content">
                  <h3>Ready to Experience the Fusion?</h3>
                  <p>Immerse yourself in the perfect blend of romance and tradition</p>
                  <button 
                    className="cta-button fusion"
                    onClick={() => scrollToSection('landing')}
                  >
                    <span>Begin Anew</span>
                    <div className="button-dragon"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="cultural-footer">
          <div className="footer-content">
            <div className="footer-symbols">
              <span>❤️</span>
              <span>🏮</span>
              <span>🐉</span>
              <span>💫</span>
            </div>
            <div className="footer-text">
              <p>Slither Sweetheart 2024 • Where Love Meets Prosperity</p>
              <div className="footer-audio">
                <span>Now {isPlaying ? 'Playing' : 'Paused'}: Harmony of Love & Prosperity</span>
              </div>
            </div>
            <div className="footer-symbols">
              <span>💝</span>
              <span>🎊</span>
              <span>✨</span>
              <span>🥠</span>
            </div>
          </div>
        </footer>

        {/* Audio element */}
        <audio
          ref={audioRef}
          loop
          src={valentineCNYEvent.audioSrc}
          preload="metadata"
        />
      </div>
    </>
  );
};

export default ValentineCNYEvent;