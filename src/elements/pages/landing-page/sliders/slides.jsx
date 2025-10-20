import './slides.css';
import './slide-css/slide1.css'
import './slide-css/slide2.css'
import './slide-css/slide3.css'
import './slide-css/slide4.css'
import './slide-css/slide5.css'
import './slide-css/slide6.css'
import RandomQuote from './quotes.jsx';
import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo, useCallback } from "react";
import { debounce, loadEventsData, safeToString } from '../utils/navUtils.js';

function Slide1() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // === Load events data ===
  useEffect(() => {
    const fetchEventsData = async () => {
      const data = await loadEventsData();
      setEventsData(data);
    };
    fetchEventsData();
  }, []);

  // === Load .webp images from GitHub and assign random backgrounds to ALL visual circles ===
  useEffect(() => {
    async function loadGitHubImages() {
      try {
        const res = await fetch(
          "https://api.github.com/repos/AchiraStudio/Gallery/contents/albums/mpls"
        );
        const files = await res.json();

        // ✅ Filter only .webp files and get their direct download URLs
        const webpUrls = files
          .filter(item => item.name.toLowerCase().endsWith(".webp"))
          .map(item => item.download_url);

        if (webpUrls.length === 0) return;

        // ✅ Select all elements with the class .visual-circle
        const circles = document.querySelectorAll(".visual-circle");

        circles.forEach(circle => {
          // Pick a random image for each circle
          const randomImage =
            webpUrls[Math.floor(Math.random() * webpUrls.length)];

          // Apply random image + visual effects
          Object.assign(circle.style, {
            backgroundImage: `url(${randomImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            borderRadius: "50%",
            opacity: 0.8,
            filter: `blur(${Math.random() * 3}px) brightness(${
              0.8 + Math.random() * 0.4
            })`,
            transform: `scale(${0.8 + Math.random() * 0.4})`,
            transition: "background 0.8s ease, filter 0.5s ease",
          });
        });
      } catch (err) {
        console.error("Failed to fetch images from GitHub:", err);
      }
    }

    loadGitHubImages();
  }, []);

  // === Memoized search function with debouncing ===
  const performSearch = useMemo(
    () =>
      debounce((query, data) => {
        if (!query.trim()) {
          setSearchResults([]);
          return;
        }

        const lowerQuery = query.toLowerCase();
        const results = data
          .filter(event =>
            Object.values(event).some(value =>
              safeToString(value).toLowerCase().includes(lowerQuery)
            )
          )
          .slice(0, 5);

        setSearchResults(results);
      }, 300),
    []
  );

  // === Handle search input changes ===
  useEffect(() => {
    performSearch(searchQuery, eventsData);
  }, [searchQuery, eventsData, performSearch]);

  // === Search field focus/blur logic ===
  const handleSearchFocus = () => setIsSearchVisible(true);
  const handleSearchBlur = () =>
    setTimeout(() => setIsSearchVisible(false), 200);

  const handleSearchSubmit = useCallback(
    e => {
      e.preventDefault();
      if (searchResults.length > 0) {
        window.location.href = searchResults[0].link || "#";
      }
    },
    [searchResults]
  );

  const handleResultClick = link => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchVisible(false);
    window.location.href = link || "#";
  };

  return (
    <div className="slider slide-1">
      <div className="slider-content">
        <div className="hero-container">
          {/* Floating decorative elements */}
          <div className="floating-elements">
            <div className="floating-element element-1">✨</div>
            <div className="floating-element element-2">🌟</div>
            <div className="floating-element element-3">⚡</div>
            <div className="floating-element element-4">🔮</div>
          </div>

          <div className="hero-content">
            <div className="hero-text">
              <h1>
                THIS IS <span className="gradient-text">RSHS</span>
              </h1>
              <div className="quotes">
                <RandomQuote />
              </div>

              {/* === Search box === */}
              <div className="search-landing-page">
                <div className="search-container-landing">
                  <div className="search-input-wrapper-landing">
                    <span className="search-icon-landing">🔍</span>
                    <input
                      type="text"
                      className="search-input-landing"
                      placeholder="Mulai pencarian mu sekarang!"
                      aria-label="Search"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onFocus={handleSearchFocus}
                      onBlur={handleSearchBlur}
                    />
                    <div className="search-line-landing"></div>
                  </div>
                  <button
                    className="search-button-landing"
                    aria-label="Submit search"
                    onClick={handleSearchSubmit}
                  >
                    <span className="button-text-landing">Search</span>
                    <span className="button-arrow-landing">→</span>
                  </button>
                </div>

                {/* === Search Results === */}
                {isSearchVisible && searchQuery && (
                  <div className="result-box-landing">
                    {searchResults.length > 0 ? (
                      searchResults.map((result, index) => (
                        <div
                          key={`${result.name}-${index}`}
                          className="results"
                          style={{ transitionDelay: `${index * 50}ms` }}
                          onClick={() => handleResultClick(result.link)}
                        >
                          <div className="result-name">
                            <h1>{result.name || "Untitled Event"}</h1>
                            <h2>{result.date || "No date specified"}</h2>
                          </div>
                          <div className="result-category">
                            <h1>{result.category || "Uncategorized"}</h1>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="results no-results">
                        <div className="result-name">
                          <h1>No events found</h1>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* === CTA Button === */}
              <div className="cta-buttons">
                <a href="#about" className="primary-btn">
                  <span className="btn-icon">👇</span>
                  <span>Explore More</span>
                  <div className="hover-sparkle">✨</div>
                </a>
              </div>
            </div>

            {/* === Hero Visual Circles === */}
            <div className="hero-visuals">
              {/* ✅ Every one of these will get a random GitHub .webp background */}
              <div className="visual-circle main-circle"></div>
              <div className="visual-circle accent-circle"></div>
              <div className="visual-circle scatter-circle scatter-1"></div>
              <div className="visual-circle scatter-circle scatter-2"></div>
              <div className="visual-circle scatter-circle scatter-3"></div>
              <div className="visual-circle scatter-circle scatter-4"></div>
              <div className="visual-circle scatter-circle scatter-5"></div>
              <div className="visual-circle scatter-circle scatter-6"></div>
              <div className="decoration-element"></div>
              <div className="cursor-follower"></div>
            </div>
          </div>

          {/* === Background Particles === */}
          <div className="particles">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: Math.random() * 0.5 + 0.3,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Slide2() {
  return (
    <div className="slider slide-2">
      <div className="slider-content">
        <div className="christmas-container_christmas">
          {/* Background Elements */}
          <div className="bg-elements_christmas">
            <div className="bg-gradient_christmas"></div>
            <div className="bg-pattern_christmas"></div>
            <div className="bg-stars_christmas">
              {[...Array(50)].map((_, i) => (
                <div 
                  key={i} 
                  className="star_christmas"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${2 + Math.random() * 3}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Christmas Lights */}
          <div className="christmas-lights_christmas">
            {[...Array(15)].map((_, i) => (
              <div 
                key={i} 
                className={`light_christmas light-${i % 3 + 1}_christmas`}
                style={{
                  left: `${5 + (i * 6)}%`,
                  animationDelay: `${i * 0.2}s`
                }}
              ></div>
            ))}
          </div>
          
          {/* Main Content */}
          <div className="content-wrapper_christmas">
            <div className="header-section_christmas">
              <div className="decorative-line_christmas"></div>
              <h1 className="main-title_christmas">
                <span className="title-part_christmas title-jingle_christmas">Jingle</span>
                <span className="title-part_christmas title-joyce_christmas">Joyce</span>
                <span className="title-ampersand_christmas">&</span>
                <span className="title-part_christmas title-charity_christmas">Charity</span>
              </h1>
              <div className="decorative-line_christmas"></div>
            </div>
            
            <p className="subtitle_christmas">
              Spread warmth and joy this festive season
            </p>
            
            <div className="cta-section_christmas">
              <Link to="/Christmas" className="cta-button_christmas">
                <span className="button-text_christmas">Join the Celebration</span>
                <span className="button-icon_christmas">🎅</span>
                <div className="button-glow_christmas"></div>
                <div className="button-particles_christmas">
                  {[...Array(8)].map((_, i) => (
                    <div 
                      key={i} 
                      className="particle_christmas"
                      style={{
                        animationDelay: `${i * 0.1}s`
                      }}
                    ></div>
                  ))}
                </div>
              </Link>
            </div>
            
            {/* Interactive Gift Counter */}
            <div className="gift-counter_christmas">
              <div className="counter-title_christmas">Days Until Christmas</div>
              <div className="counter-number_christmas">
                <span className="digit_christmas">2</span>
                <span className="digit_christmas">5</span>
              </div>
              <div className="counter-gifts_christmas">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className="mini-gift_christmas"
                    style={{
                      animationDelay: `${i * 0.2}s`
                    }}
                  >🎁</div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Enhanced Decorative Elements */}
          <div className="decorations_christmas">
            <div className="decoration-item_christmas deco-1_christmas">❄️</div>
            <div className="decoration-item_christmas deco-2_christmas">🎄</div>
            <div className="decoration-item_christmas deco-3_christmas">🎁</div>
            <div className="decoration-item_christmas deco-4_christmas">⭐</div>
            <div className="decoration-item_christmas deco-5_christmas">🔔</div>
            <div className="decoration-item_christmas deco-6_christmas">🎅</div>
            <div className="decoration-item_christmas deco-7_christmas">🤶</div>
            <div className="decoration-item_christmas deco-8_christmas">🦌</div>
            <div className="decoration-item_christmas deco-9_christmas">🛷</div>
            <div className="decoration-item_christmas deco-10_christmas">🍪</div>
          </div>
          
          {/* Music Notes */}
          <div className="music-notes_christmas">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="note_christmas"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 10}s`,
                  animationDuration: `${5 + Math.random() * 5}s`
                }}
              >♪</div>
            ))}
          </div>
          
          {/* Enhanced Animated Snow */}
          <div className="snow-container_christmas">
            {[...Array(40)].map((_, i) => (
              <div 
                key={i} 
                className="snowflake_christmas"
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
            ))}
          </div>
          
          {/* Enhanced Floating Orbs */}
          <div className="floating-orbs_christmas">
            <div className="orb_christmas orb-1_christmas"></div>
            <div className="orb_christmas orb-2_christmas"></div>
            <div className="orb_christmas orb-3_christmas"></div>
            <div className="orb_christmas orb-4_christmas"></div>
          </div>
          
          {/* Interactive Mouse Follower */}
          <div className="cursor-glow_christmas"></div>
        </div>
      </div>
    </div>
  );
}

function Slide3() {
  return (
    <div className="slider slide-3">
      <div className="slider-content">
        <div className="hero-container valentine-theme">
          {/* Valentine decorative elements */}
          <div className="floating-elements valentine-elements">
            <div className="floating-element element-1">❤</div>
            <div className="floating-element element-2">❤</div>
            <div className="floating-element element-3">❤</div>
            <div className="floating-element element-4">❤</div>
            <div className="floating-element element-5">❤</div>
          </div>
          
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="valentine-title">Slither Sweetheart</h1>
              <p className="valentine-subtitle">Find your perfect match this Valentine's Day</p>
              
              <div className="cta-buttons">
                <Link to="/Valentine">
                  <div className="button-slider valentine-btn">
                    <h1>Take Me There! ❤</h1>
                    <div className="heart-pulse" />
                  </div>
                </Link>
              </div>
            </div>
            
            <div className="hero-visuals">
              <div className="decoration-element"></div>
              <div className="visual-circle main-circle"></div>
              <div className="visual-circle accent-circle"></div>
              
              {/* Animated cursor follower */}
              <div className="cursor-follower"></div>
            </div>
          </div>
          
          {/* Interactive background hearts */}
          <div className="particles hearts">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="particle heart" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.5 + 0.3
              }}>❤</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Slide4() {
  return (
    <div className="slider slide-4">
      <div className="slider-content">
        <div className="hero-container easter-theme">
          {/* Easter decorative elements */}
          <div className="floating-elements easter-elements">
            <div className="floating-element element-1">🥚</div>
            <div className="floating-element element-2">🥚</div>
            <div className="floating-element element-3">🐇</div>
            <div className="floating-element element-4">🧺</div>
          </div>
          
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="easter-title">Hop Into Spring!</h1>
              <p className="easter-subtitle">Join our egg-citing Easter events</p>
              
              <div className="cta-buttons">
                <Link to="/Charity">
                  <div className="button-slider easter-btn">
                    <span className="btn-text">Easter Charity</span>
                    <span className="easter-icon">🐣</span>
                    <div className="sparkles">✨✨✨</div>
                  </div>
                </Link>
              </div>
            </div>
            
            <div className="hero-visuals">
              <div className="decoration-element"></div>
              <div className="visual-circle main-circle"></div>
              <div className="visual-circle accent-circle"></div>
              
              {/* Animated cursor follower */}
              <div className="cursor-follower"></div>
            </div>
          </div>
          
          {/* Interactive background flowers */}
          <div className="particles easter-fall">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="particle easter-flower" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.5 + 0.3
              }}>{['🌷', '🌸', '🌼', '🌹', '💐'][Math.floor(Math.random() * 5)]}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Slide5() {
  return (
    <div className="slider slide-open">
      <div className="slider-content">
        <div className="hero-container recruit-theme">
          {/* Recruitment decorative elements */}
          <div className="floating-elements recruit-elements">
            <div className="floating-element element-1">🎖️</div>
            <div className="floating-element element-2">🏆</div>
            <div className="floating-element element-3">🥇</div>
            <div className="floating-element element-4">🎉</div>
            <div className="floating-element element-5">✨</div>
          </div>
          
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="recruit-title">Join Our Team!</h1>
              <p className="recruit-subtitle">Exciting opportunities await new recruits</p>
              
              <div className="cta-buttons">
                <div className="button-slider recruit-btn" onClick={() => joinUs()}>
                  <span className="btn-text">Coming Soon</span>
                  <span className="celebrate">🎯</span>
                  <div className="sparkles">✨✨✨</div>
                </div>
              </div>
            </div>
            
            <div className="hero-visuals">
              <div className="decoration-element"></div>
              <div className="visual-circle main-circle"></div>
              <div className="visual-circle accent-circle"></div>
              
              {/* Animated cursor follower */}
              <div className="cursor-follower"></div>
            </div>
          </div>
          
          {/* Interactive background confetti */}
          <div className="particles confetti">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="particle confetti-piece" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.5 + 0.3
              }}>{['🎉', '✨', '🎊', '🌟', '🥳'][Math.floor(Math.random() * 5)]}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Slide6() {
  return (
    <div className="slider slide-70rp">
      <div className="slider-content">
        <div className="hero-container birthday-theme">
          {/* Birthday decorative elements */}
          <div className="floating-elements birthday-elements">
            <div className="floating-element element-1">🎂</div>
            <div className="floating-element element-2">🎁</div>
            <div className="floating-element element-3">🎓</div>
            <div className="floating-element element-4">70</div>
          </div>
          
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="rp-title">HAPPY 70TH BIRTHDAY RP! 🎉</h1>
              <p className="rp-subtitle">Celebrating 70 years of excellence and memories</p>
              
              <div className="cta-buttons">
                <div 
                  className="button-slider birthday-btn"
                  onClick={() => window.open('events/birthday.html', '_blank')}
                >
                  <span className="btn-text">Join Celebration</span>
                  <span className="party-icon">🎯</span>
                  <div className="sparkles">✨✨✨</div>
                </div>
              </div>
            </div>
            
            <div className="hero-visuals">
              <div className="decoration-element"></div>
              <div className="visual-circle main-circle"></div>
              <div className="visual-circle accent-circle"></div>
              
              {/* Animated cursor follower */}
              <div className="cursor-follower"></div>
            </div>
          </div>
          
          {/* Interactive background birthday confetti */}
          <div className="particles birthday-confetti">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i}
                className="particle confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: Math.random() * 0.5 + 0.3,
                  fontSize: `${Math.random() * 1 + 1}rem`,
                  color: `hsl(${Math.random() * 360}, 100%, 70%)`
                }}
              >
                {['🎉', '✨', '🎊', '🎈', '🥳'][Math.floor(Math.random() * 5)]}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { Slide1, Slide2, Slide3, Slide4, Slide5, Slide6 };