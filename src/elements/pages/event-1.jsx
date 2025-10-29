import { useState, useRef, useEffect, useCallback } from 'react';
import './css/christmas.css';
import eventData from '../json/events.json';
import { FaPlay, FaPause, FaSnowflake, FaStar, FaGift } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import DynamicIsland from '../../rshs/Components/DynamicI';

const ChristmasEvent = () => {
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
  const mainRef = useRef(null);
  const navigate = useNavigate();

  // Get event data from JSON
  const christmasEvent = eventData.events.christmas;

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
      const sections = [landingRef, aboutRef, mainRef];
      const current = sections.findIndex(ref => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          return rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2;
        }
        return false;
      });
      
      if (current !== -1) {
        setActiveSection(['landing', 'about', 'main'][current]);
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

  // Floating particles effect
  const renderFloatingElements = () => {
    const elements = [];
    for (let i = 0; i < 15; i++) {
      const style = {
        left: `${Math.random() * 100}%`,
        animationDuration: `${15 + Math.random() * 20}s`,
        animationDelay: `${Math.random() * 10}s`,
        fontSize: `${Math.random() * 16 + 8}px`,
      };
      const type = Math.random();
      let content;
      if (type < 0.33) content = '❄';
      else if (type < 0.66) content = '★';
      else content = '❅';
      
      elements.push(
        <div key={i} className="floating-element" style={style}>
          {content}
        </div>
      );
    }
    return elements;
  };

  const scrollToSection = (section) => {
    const sections = {
      landing: landingRef,
      about: aboutRef,
      main: mainRef
    };
    sections[section]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
  <>
    <DynamicIsland></DynamicIsland>

    {/* Progress Bar */}
    <div className="scroll-progress" style={{ width: `${scrollProgress}%` }}></div>

    <div className="christmas-landing">
      {/* Floating Background Elements */}
      <div className="floating-background">
        {renderFloatingElements()}
      </div>

      {/* Landing Section */}
      <section ref={landingRef} className="landing-section">
        <div className="landing-content">
          <div className="title-container">
            <h1 className="main-title">
              <span className="title-line">Jingle</span>
              <span className="title-line accent">Joyce</span>
              <span className="title-line">2024</span>
            </h1>

            <div className="subtitle-container">
              <p className="event-subtitle">
                Perayaan Natal Regina Pacis – Penuh Sukacita & Kasih
              </p>
              <div className="title-decoration">
                <FaStar className="decoration-icon" />
                <FaSnowflake className="decoration-icon" />
                <FaGift className="decoration-icon" />
              </div>
            </div>
          </div>

          <div className="cta-container">
            <button 
              className="cta-button primary"
              onClick={() => scrollToSection('main')}
            >
              <span>Mulai Pengalaman</span>
              <div className="button-sparkle"></div>
            </button>
            
            <div className="audio-player-mini">
              <button
                className={`play-btn-mini ${isPlaying ? 'playing' : ''}`}
                onClick={togglePlay}
                aria-label={isPlaying ? 'Jeda musik' : 'Putar musik'}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <div className="track-info">
                <span className="track-title">Suasana Natal</span>
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
            <span>Gulir untuk menjelajahi</span>
          </div>
        </div>

        {/* Background Ornaments */}
        <div className="landing-ornaments">
          <div className="ornament large left"></div>
          <div className="ornament medium right"></div>
          <div className="ornament small center"></div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="about-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-accent">Tentang</span>
              Acara Ini
            </h2>
            <div className="section-divider"></div>
          </div>

          <div className="about-content">
            <div className="about-text">
              <p className="lead-text">
                Selamat datang di <b>Jingle Joyce 2024</b> — perayaan Natal Regina Pacis yang memadukan kehangatan tradisi, semangat berbagi, dan keceriaan modern.
              </p>

              <div className="feature-grid">
                <div className="feature-card">
                  <div className="feature-icon">
                    <FaSnowflake />
                  </div>
                  <h3>Suasana Ajaib</h3>
                  <p>Rasakan keindahan musim Natal dengan dekorasi menawan dan efek visual yang memukau.</p>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon">
                    <FaStar />
                  </div>
                  <h3>Penampilan Spesial</h3>
                  <p>Nikmati berbagai pertunjukan dari siswa-siswi Regina Pacis yang penuh talenta dan semangat Natal.</p>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon">
                    <FaGift />
                  </div>
                  <h3>Kegiatan & Amal</h3>
                  <p>Ikuti permainan seru, kunjungi photobooth, dan berpartisipasi dalam kegiatan amal penuh kasih.</p>
                </div>
              </div>
            </div>

            <div className="about-stats">
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Keceriaan</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Kasih Natal</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">∞</span>
                <span className="stat-label">Kehangatan</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Section */}
      <section ref={mainRef} className="main-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              Pengalaman
              <span className="title-accent"> Natal</span>
            </h2>
            <div className="section-divider"></div>
          </div>

          <div className="main-content">
            <div className="experience-cards">
              <div className="experience-card large">
                <div className="card-content">
                  <h3>Pengalaman Audio Lengkap</h3>
                  <p>Nikmati playlist Natal kami yang menenangkan dan penuh sukacita.</p>
                  
                  <div className="audio-player-full">
                    <div className="player-header">
                      <span className="track-name">Keajaiban Natal</span>
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
                        <span>{isPlaying ? 'Jeda' : 'Putar'}</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-glow"></div>
              </div>

              <div className="experience-card">
                <div className="card-content">
                  <h3>Visual Ajaib</h3>
                  <p>Salju berjatuhan dan bintang berkelap-kelip menciptakan suasana yang memikat hati.</p>
                  <div className="visual-demo">
                    <div className="demo-snowflake"></div>
                    <div className="demo-star"></div>
                    <div className="demo-sparkle"></div>
                  </div>
                </div>
              </div>

              <div className="experience-card">
                <div className="card-content">
                  <h3>Keanggunan Natal</h3>
                  <p>Sentuhan warna gelap dan emas memberikan kesan hangat, elegan, dan berkelas.</p>
                  <div className="color-palette">
                    <div className="color-swatch dark"></div>
                    <div className="color-swatch gold"></div>
                    <div className="color-swatch red"></div>
                    <div className="color-swatch green"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="main-cta">
              <p className="cta-text">
                Lihat semua momen penuh sukacita kami
              </p>
              <button 
                className="cta-button secondary"
                onClick={() => navigate('/Gallery')}
              >
                <span>Kunjungi Galeri Kami</span>
                <div className="button-sparkle"></div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="christmas-footer">
        <div className="footer-content">
          <div className="footer-links">
            <span>© {new Date().getFullYear()} Jingle Joyce – Regina Pacis</span>
            <span>•</span>
            <span>Dibuat dengan ❤️ dan sukacita</span>
          </div>
          <div className="footer-audio">
            <span>{isPlaying ? 'Sedang diputar' : 'Dijeda'}: Suasana Natal</span>
          </div>
        </div>
      </footer>

      {/* Audio element */}
      <audio
        ref={audioRef}
        loop
        src={christmasEvent.audioSrc}
        preload="metadata"
      />
    </div>
  </>
  );
};

export default ChristmasEvent;