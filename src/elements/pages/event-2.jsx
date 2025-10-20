import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import './css/charity.css';
import eventData from '../json/events.json';

const CharityEvent = () => {
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
  const [showParticles, setShowParticles] = useState(true);
  const [donationAmount, setDonationAmount] = useState(25);
  const [donationMessage, setDonationMessage] = useState('');

  // Refs
  const audioRef = useRef(null);
  const particlesRef = useRef(null);

  // Get event data from JSON
  const charityEvent = eventData.events.easter;

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

  // Hope particles (pure CSS/HTML)
  const renderHopeParticles = () => {
    if (!showParticles) return null;
    const particles = [];
    const symbols = ['❤', '✨', '🌟', '🙏', '🤝'];
    for (let i = 0; i < 40; i++) {
      const style = {
        left: `${Math.random() * 100}%`,
        animationDuration: `${4 + Math.random() * 8}s`,
        animationDelay: `${Math.random() * 5}s`,
        opacity: Math.random() * 0.5 + 0.5,
        fontSize: `${Math.random() * 12 + 12}px`,
        color: ['#4a90e2', '#50c878', '#ff6b6b', '#feca57', '#ae81ff'][Math.floor(Math.random() * 5)]
      };
      particles.push(
        <div key={i} className="hope-particle_charity" style={style}>
          {symbols[Math.floor(Math.random() * symbols.length)]}
        </div>
      );
    }
    return particles;
  };

  // Image loading handler
  const handleImageLoad = useCallback((index) => {
    setLoadedImages(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  // Donation handler
  const handleDonate = useCallback(() => {
    alert(`Thank you for your donation of $${donationAmount}!${donationMessage ? ` Your message: "${donationMessage}"` : ''}`);
    setDonationAmount(25);
    setDonationMessage('');
  }, [donationAmount, donationMessage]);

  return (
    <div className="charity-event_charity">
      {/* Hope particles effect */}
      <div className="particles-container_charity">
        {renderHopeParticles()}
      </div>

      {/* Header with cover art and player */}
      <header className="event-header_charity">
        <div className="header-content_charity">
          <div className="cover-art-container_charity">
            <img
              src={charityEvent.coverImage}
              alt={`${charityEvent.title} Cover`}
              className={`cover-art_charity ${coverImageLoaded ? 'loaded' : 'loading'}`}
              onLoad={() => setCoverImageLoaded(true)}
            />
            {!coverImageLoaded && (
              <div className="cover-art-placeholder_charity">
                <span className="placeholder-icon_charity">❤️</span>
              </div>
            )}
            <div className="cover-art-decoration_charity">
              <span className="heart-decoration_charity">❤️</span>
              <div className="ribbon-decoration_charity"></div>
            </div>
          </div>

          <div className="event-info_charity">
            <h1 className="event-title_charity">
              <span className="title-text_charity">{charityEvent.title}</span>
              <span className="title-decoration_charity">🤝</span>
            </h1>
            <p className="event-subtitle_charity">{charityEvent.subtitle}</p>
            {/* <div className="donation-meter_charity">
              <div className="meter-label_charity">Fundraising Progress</div>
              <div className="meter-bar_charity">
                <div className="meter-progress_charity" style={{width: '65%'}}>
                  <span className="meter-text_charity">65%</span>
                </div>
              </div>
              <div className="meter-stats_charity">
                <span>$32,500 raised of $50,000 goal</span>
              </div>
            </div> */}
          </div>

          <div className="audio-player_charity">
            <div className="progress-container_charity">
              <input
                type="range"
                className="progress-bar_charity"
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
              <div className="time-display_charity">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="player-controls_charity">
              <button className="control-btn_charity" aria-label="Previous track">
                <span>⏮</span>
              </button>
              <button
                className={`control-btn_charity play-btn_charity ${isPlaying ? 'playing' : ''}`}
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                <span>{isPlaying ? '⏸' : '⏵'}</span>
              </button>
              <button className="control-btn_charity" aria-label="Next track">
                <span>⏭</span>
              </button>

              {/* <div className="volume-control_charity">
                <button
                  className="mute-btn_charity"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  <span>{isMuted ? '🔇' : '🔊'}</span>
                </button>
                <input
                  type="range"
                  className="volume-slider_charity"
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

        <div className="header-decoration_charity">
          <div className="ornament_charity left_charity"></div>
          <div className="ornament_charity right_charity"></div>
          <div className="hope-garland_charity"></div>
        </div>
      </header>

      {/* Main content area */}
      <main className="event-main_charity">
        <nav className="content-nav_charity">
          <button
            className={`nav-btn_charity ${activeTab === 'about' ? 'active_charity' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button
            className={`nav-btn_charity ${activeTab === 'impact' ? 'active_charity' : ''}`}
            onClick={() => setActiveTab('impact')}
          >
            Our Impact
          </button>
          {/* <button
            className={`nav-btn_charity ${activeTab === 'donate' ? 'active_charity' : ''}`}
            onClick={() => setActiveTab('donate')}
          >
            Donate
          </button> */}
          <button
            className={`nav-btn_charity ${activeTab === 'gallery' ? 'active_charity' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            Gallery
          </button>
        </nav>

        <div className="content-container_charity">
          {activeTab === 'about' && (
            <section className="about-section_charity">
              <h2>
                <span className="section-icon_charity">❤️</span>
                About Our Cause
                <span className="section-icon_charity">❤️</span>
              </h2>

              <p className="mission-statement_charity">
                {charityEvent.description || "We are dedicated to making a positive impact in our community through compassion, action, and generosity. Every contribution helps us create meaningful change in the lives of those who need it most."}
              </p>
              
              <div className="impact-stats_charity">
                <div className="stat-item_charity">
                  <div className="stat-number_charity">5,000+</div>
                  <div className="stat-label_charity">Lives Impacted</div>
                </div>
                <div className="stat-item_charity">
                  <div className="stat-number_charity">200+</div>
                  <div className="stat-label_charity">Projects Completed</div>
                </div>
                <div className="stat-item_charity">
                  <div className="stat-number_charity">15</div>
                  <div className="stat-label_charity">Years of Service</div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'impact' && (
            <section className="impact-section_charity">
              <h2>
                <span className="section-icon_charity">✨</span>
                Making a Difference
              </h2>
              
              <div className="impact-cards_charity">
                <div className="impact-card_charity">
                  <div className="card-icon_charity">🏠</div>
                  <h3>Housing Support</h3>
                  <p>Providing safe and stable housing for families in need through our community partnerships.</p>
                </div>
                
                <div className="impact-card_charity">
                  <div className="card-icon_charity">🍎</div>
                  <h3>Food Security</h3>
                  <p>Distributing nutritious meals to over 1,000 families each month through our food bank network.</p>
                </div>
                
                <div className="impact-card_charity">
                  <div className="card-icon_charity">🎓</div>
                  <h3>Education Programs</h3>
                  <p>Supporting educational initiatives that help children and adults reach their full potential.</p>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'donate' && (
            <section className="donate-section_charity">
              <h2>
                <span className="section-icon_charity">🤝</span>
                Make a Difference
              </h2>
              
              <div className="donation-options_charity">
                <div className="donation-form_charity">
                  <h3>Your Support Matters</h3>
                  
                  <div className="amount-options_charity">
                    <button 
                      className={`amount-option_charity ${donationAmount === 10 ? 'selected_charity' : ''}`}
                      onClick={() => setDonationAmount(10)}
                    >
                      $10
                    </button>
                    <button 
                      className={`amount-option_charity ${donationAmount === 25 ? 'selected_charity' : ''}`}
                      onClick={() => setDonationAmount(25)}
                    >
                      $25
                    </button>
                    <button 
                      className={`amount-option_charity ${donationAmount === 50 ? 'selected_charity' : ''}`}
                      onClick={() => setDonationAmount(50)}
                    >
                      $50
                    </button>
                    <button 
                      className={`amount-option_charity ${donationAmount === 100 ? 'selected_charity' : ''}`}
                      onClick={() => setDonationAmount(100)}
                    >
                      $100
                    </button>
                    <div className="custom-amount_charity">
                      <label>$</label>
                      <input 
                        type="number" 
                        placeholder="Other amount"
                        value={donationAmount === 10 || donationAmount === 25 || donationAmount === 50 || donationAmount === 100 ? '' : donationAmount}
                        onChange={(e) => setDonationAmount(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  
                  <div className="donation-message_charity">
                    <label>Optional message of support:</label>
                    <textarea 
                      placeholder="Share an encouraging message..."
                      value={donationMessage}
                      onChange={(e) => setDonationMessage(e.target.value)}
                    />
                  </div>
                  
                  <button className="donate-button_charity" onClick={handleDonate}>
                    Donate Now
                  </button>
                </div>
                
                <div className="donation-impact_charity">
                  <h3>What Your Donation Provides</h3>
                  <ul>
                    <li>$10 → Provides 5 meals for someone in need</li>
                    <li>$25 → Supplies educational materials for a child</li>
                    <li>$50 → Supports a family with essential supplies for a week</li>
                    <li>$100 → Funds crisis intervention services</li>
                  </ul>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'gallery' && (
            <section className="gallery-section_charity">
              <h2>
                <span className="section-icon_charity">📸</span>
                Making an Impact
              </h2>
              <div className="gallery-grid_charity">
                {charityEvent.galleryImages.map((img, index) => (
                  <div
                    className="gallery-item_charity"
                    key={index}
                    style={{ '--delay': `${index * 0.1}s` }}
                  >
                    {!loadedImages.has(index) && (
                      <div className="image-placeholder_charity">
                        <span className="placeholder-icon_charity">❤️</span>
                      </div>
                    )}
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading={index < 3 ? "eager" : "lazy"}
                      className={`gallery-image_charity ${loadedImages.has(index) ? 'loaded' : 'loading'}`}
                      onLoad={() => handleImageLoad(index)}
                    />
                    <div className="image-caption_charity">
                      <h4>{img.title || "Community Support"}</h4>
                      <p>{img.caption || "Making a difference together"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="event-footer_charity">
        <div className="footer-content_charity">
          <p>© {new Date().getFullYear()} {charityEvent.title}. All donations are tax deductible. EIN: 12-3456789</p>
          <div className="footer-decoration_charity">
            <div className="footer-hearts_charity"></div>
          </div>
        </div>
      </footer>

      {/* Audio element */}
      <audio
        ref={audioRef}
        loop
        src={charityEvent.audioSrc}
        preload="metadata"
      />
    </div>
  );
};

export default CharityEvent;