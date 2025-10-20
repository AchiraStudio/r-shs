import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import './css/mpls.css';
import eventData from '../json/events.json';
import NavMobile from './landing-page/Nav-mobile.jsx'
import Header from './landing-page/Header.jsx'

const Mpls = () => {
  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);

  // UI state
  const [coverImageLoaded, setCoverImageLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [activeTab, setActiveTab] = useState('about');
  const [showSunrays, setShowSunrays] = useState(true);
  const [showClouds, setShowClouds] = useState(true);

  // Refs
  const audioRef = useRef(null);
  const cloudsRef = useRef(null);

  // Get event data from JSON
  const mplsEvent = eventData.events.mpls;

  // Audio controls
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleProgressChange = useCallback((e) => {
    const value = Number(e.target.value);
    const newTime = (value / 100) * duration;
    if (audioRef.current) audioRef.current.currentTime = newTime;
    setProgress(value);
  }, [duration]);

  const handleVolumeChange = useCallback((e) => {
    const newVolume = Number(e.target.value);
    if (audioRef.current) audioRef.current.volume = newVolume;
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) setIsMuted(false);
  }, [isMuted]);

  const formatTime = useCallback((time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, []);

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

  // Sunrays effect
  const renderSunrays = () => {
    if (!showSunrays) return null;
    const rays = [];
    for (let i = 0; i < 12; i++) {
      const style = {
        transform: `rotate(${i * 30}deg)`,
        animationDelay: `${i * 0.1}s`
      };
      rays.push(
        <div key={i} className="sunray_mpls" style={style}></div>
      );
    }
    return rays;
  };

  // Floating clouds
  useEffect(() => {
    if (!showClouds || !cloudsRef.current) return;
    const container = cloudsRef.current;
    const cloudCount = 8;
    
    while (container.firstChild) container.removeChild(container.firstChild);
    
    for (let i = 0; i < cloudCount; i++) {
      const cloud = document.createElement('div');
      cloud.className = 'floating-cloud_mpls';
      
      const sizes = ['small', 'medium', 'large'];
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      cloud.classList.add(size);
      
      const posX = Math.random() * 100;
      const posY = 20 + Math.random() * 60;
      
      cloud.style.left = `${posX}%`;
      cloud.style.top = `${posY}%`;
      cloud.style.opacity = `${0.4 + Math.random() * 0.4}`;
      cloud.style.animationDuration = `${20 + Math.random() * 20}s`;
      cloud.style.animationDelay = `-${Math.random() * 20}s`;
      
      container.appendChild(cloud);
    }
    
    return () => {
      while (container.firstChild) container.removeChild(container.firstChild);
    };
  }, [showClouds]);

  // Image loading handler
  const handleImageLoad = useCallback((index) => {
    setLoadedImages(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  return (
    <>
    <NavMobile />
    <Header />
    <div className="mpls-event_mpls">
      {/* Sun with rays */}
      <div className="sun-container_mpls">
        <div className="sun_mpls">
          {renderSunrays()}
        </div>
      </div>

      {/* Floating clouds */}
      <div className="clouds-container_mpls" ref={cloudsRef}></div>

      {/* Header with cover art and player */}
      <header className="event-header_mpls">
        <div className="header-content_mpls">
          <div className="cover-art-container_mpls">
            <img
              src={mplsEvent.coverImage}
              alt={`${mplsEvent.title} Cover`}
              className={`cover-art_mpls ${coverImageLoaded ? 'loaded' : 'loading'}`}
              onLoad={() => setCoverImageLoaded(true)}
            />
            {!coverImageLoaded && (
              <div className="cover-art-placeholder_mpls">
                <span className="placeholder-icon_mpls">📚</span>
              </div>
            )}
            <div className="cover-art-decoration_mpls">
              <span className="star-decoration_mpls">⭐</span>
              <div className="pencil-decoration_mpls">✏️</div>
            </div>
          </div>

          <div className="event-info_mpls">
            <h1 className="event-title_mpls">
              <span className="title-text_mpls">{mplsEvent.title}</span>
              {/* <span className="title-decoration_mpls">🎓</span> */}
            </h1>
            <p className="event-subtitle_mpls">{mplsEvent.subtitle}</p>
            
            <div className="school-stats_mpls">
              <div className="stat-item_mpls">
                <div className="stat-number_mpls">95%</div>
                <div className="stat-label_mpls">Graduation Rate</div>
              </div>
              <div className="stat-item_mpls">
                <div className="stat-number_mpls">1st</div>
                <div className="stat-label_mpls">Bogor Rank</div>
              </div>
              <div className="stat-item_mpls">
                <div className="stat-number_mpls">43rd</div>
                <div className="stat-label_mpls">LTMPT "(National)" Ranking</div>
              </div>
            </div>
          </div>

          <div className="audio-player_mpls">
            <div className="progress-container_mpls">
              <input
                type="range"
                className="progress-bar_mpls"
                value={progress}
                min={0}
                max={100}
                step={0.1}
                onChange={handleProgressChange}
                style={{ '--progress': `${progress}%` }}
                aria-label="Track progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              />
              <div className="time-display_mpls">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="player-controls_mpls">
              <button className="control-btn_mpls" aria-label="Previous track">
                <span>⏮</span>
              </button>
              <button
                className={`control-btn_mpls play-btn_mpls ${isPlaying ? 'playing' : ''}`}
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                <span>{isPlaying ? '⏸' : '⏵'}</span>
              </button>
              <button className="control-btn_mpls" aria-label="Next track">
                <span>⏭</span>
              </button>

              {/* <div className="volume-control_mpls">
                <button
                  className="mute-btn_mpls"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  <span>{isMuted ? '🔇' : '🔊'}</span>
                </button>
                <input
                  type="range"
                  className="volume-slider_mpls"
                  value={volume}
                  min={0}
                  max={1}
                  step="0.01"
                  onChange={handleVolumeChange}
                  style={{ '--volume': `${volume * 100}%` }}
                  aria-label="Volume control"
                  aria-valuemin={0}
                  aria-valuemax={1}
                  aria-valuenow={volume}
                />
              </div> */}
            </div>
          </div>
        </div>

        <div className="header-decoration_mpls">
          <div className="ornament_mpls left_mpls">📚</div>
          <div className="ornament_mpls right_mpls">✏️</div>
          <div className="education-garland_mpls"></div>
        </div>
      </header>

      {/* Main content area */}
      <main className="event-main_mpls">
        <nav className="content-nav_mpls">
          <button
            className={`nav-btn_mpls ${activeTab === 'about' ? 'active_mpls' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button
            className={`nav-btn_mpls ${activeTab === 'academics' ? 'active_mpls' : ''}`}
            onClick={() => setActiveTab('academics')}
          >
            Academics
          </button>
          <button
            className={`nav-btn_mpls ${activeTab === 'activities' ? 'active_mpls' : ''}`}
            onClick={() => setActiveTab('activities')}
          >
            Activities
          </button>
          <button
            className={`nav-btn_mpls ${activeTab === 'gallery' ? 'active_mpls' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            Gallery
          </button>
        </nav>

        <div className="content-container_mpls">
          {activeTab === 'about' && (
            <section className="about-section_mpls">
              <h2>
                <span className="section-icon_mpls">🏫</span>
                About Our School
                <span className="section-icon_mpls">🏫</span>
              </h2>

              <p className="mission-statement_mpls">
                {mplsEvent.description || "Welcome to Minneapolis Public Schools, where we empower students to achieve excellence through innovative education, inclusive communities, and lifelong learning. Our dedicated educators provide a nurturing environment that fosters academic growth and personal development."}
              </p>
              
              <div className="school-info_mpls">
                <div className="info-card_mpls">
                  <h3>🏆 Our Mission</h3>
                  <p>Menyelenggarakan pendidikan menengah atas yang unggul dan berkarakter, berbasis teknologi dan global, serta mengembangkan bakat, kepribadian, dan kerjasama demi kualitas akademik maupun non-akademik peserta didik.</p>
                </div>
                
                <div className="info-card_mpls">
                  <h3>🌅 Our Vision</h3>
                  <p>Menjadi Sekolah Menengah Atas bereputasi akademik unggul untuk
                            menghasilkan lulusan yang berbudaya Indonesia dan berwawasan global
                            dengan berlandaskan semangat FMM: Belas Kasih, Rendah Hati,
                            Integritas, Damai, dan Kepemimpinan yang melayani.</p>
                </div>
                
                {/* <div className="info-card_mpls">
                  <h3>🤝 Our Values</h3>
                  <p>Excellence, Integrity, Diversity, Innovation, and Community are the core values that guide everything we do at Minneapolis Public Schools.</p>
                </div> */}
              </div>
            </section>
          )}

          {activeTab === 'academics' && (
            <section className="academics-section_mpls">
              <h2>
                <span className="section-icon_mpls">📚</span>
                Academic Programs
              </h2>
              
              <div className="academics-grid_mpls">
                <div className="program-card_mpls">
                  <div className="card-icon_mpls">🔬</div>
                  <h3>STEM Program</h3>
                  <p>Our Science, Technology, Engineering, and Math program prepares students for careers in high-demand fields through hands-on learning and partnerships with local industries.</p>
                </div>
                
                <div className="program-card_mpls">
                  <div className="card-icon_mpls">🎨</div>
                  <h3>Arts & Humanities</h3>
                  <p>From visual arts to performing arts, our comprehensive program nurtures creativity and critical thinking skills essential for well-rounded education.</p>
                </div>
                
                {/* <div className="program-card_mpls">
                  <div className="card-icon_mpls">🌍</div>
                  <h3>International Baccalaureate</h3>
                  <p>Our IB program offers a challenging curriculum that develops internationally-minded students who recognize their common humanity.</p>
                </div> */}
                
                <div className="program-card_mpls">
                  <div className="card-icon_mpls">🏀</div>
                  <h3>Athletics</h3>
                  <p>We believe in developing the whole student through competitive sports that teach teamwork, discipline, and sportsmanship.</p>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'activities' && (
            <section className="activities-section_mpls">
              <h2>
                <span className="section-icon_mpls">🎭</span>
                Student Activities
              </h2>
              
              <div className="activities-container_mpls">
                <div className="clubs-list_mpls">
                  <h3>Clubs & Organizations</h3>
                  <ul>
                    <li>OSIS</li>
                    <li>Robotics Club</li>
                    <li>Debate Team</li>
                    <li>Environmental Club</li>
                    <li>Math League</li>
                    <li>Journalism/Newspaper</li>
                    <li>Drama Club</li>
                    <li>Music Ensembles</li>
                    <li>Cultural Awareness Club</li>
                    <li>Community Service Club</li>
                  </ul>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'gallery' && (
  <section className="gallery-section_mpls">
    <h2>
      <span className="section-icon_mpls">📸</span>
      School Life Gallery
    </h2>
    <div className="gallery-grid_mpls">
      {mplsEvent.galleryImages.map((img, index) => (
        <div
          className="gallery-item_mpls"
          key={index}
          style={{ '--delay': `${index * 0.1}s` }}
        >
          {!loadedImages.has(index) && (
            <div className="image-placeholder_mpls">
              <span className="placeholder-icon_mpls">📚</span>
            </div>
          )}
          <img
            src={img.src}
            alt={img.alt}
            loading={index < 3 ? "eager" : "lazy"}
            className={`gallery-image_mpls ${loadedImages.has(index) ? 'loaded' : 'loading'}`}
            onLoad={() => handleImageLoad(index)}
          />
          <div className="image-caption_mpls">
            <h4>{img.title || "School Activity"}</h4>
            <p>{img.caption || "Learning and growing together"}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
)}
        </div>
      </main>

      {/* Footer */}
      <footer className="event-footer_mpls">
        <div className="footer-content_mpls">
          <p>© {new Date().getFullYear()} {mplsEvent.title}. Empowering students since 1954.</p>
          <div className="footer-decoration_mpls">
            <div className="footer-books_mpls"></div>
          </div>
        </div>
      </footer>

      {/* Audio element */}
      <audio
        ref={audioRef}
        loop
        src={mplsEvent.audioSrc}
        preload="metadata"
      />
    </div>
    </>
  );
};

export default Mpls;