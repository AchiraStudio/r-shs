import './Slides.css';
import Timeline from '../../elements/pages/landing-page/Timeline'
import About from '../../elements/pages/landing-page/About'
import CrewSection from '../../elements/pages/landing-page/Crew'
import Footer from '../../elements/pages/landing-page/Footer'
import RandomQuote from '../../elements/pages/landing-page/sliders/quotes';

// Slide 1 - Modern Main Welcome
export const Slide1 = () => {
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
        {[...Array(30)].map((_, i) => (
          <div key={i} className="particle"></div>
        ))}
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
            
            <p className="slide-subtitle quotes">
              <RandomQuote></RandomQuote>
            </p>
            
            {/* <div className="slide-search">
              
            </div> */}
            
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
              {/* <div className="feature-item">
                <div className="feature-icon">🌍</div>
                <span>Global Community</span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
    <Timeline></Timeline>
    <About></About>
    <CrewSection></CrewSection>
    <Footer></Footer>
    </>
  );
};

// Slide 2 - Christmas Theme
export const Slide2 = () => {
  return (
    <>
    <div className="slide-content slide-2 slide-christmas">
      {/* Background Elements from old design */}
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
      
      {/* Enhanced Snowfall */}
      <div className="snowfall">
        {[...Array(100)].map((_, i) => (
          <div 
            key={i} 
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
        ))}
      </div>
      
      {/* Christmas Lights */}
      <div className="christmas-lights">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className={`light light-${i % 3 + 1}`}
            style={{
              animationDelay: `${i * 0.2}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* Music Notes from old design */}
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
      
      {/* Floating Orbs from old design */}
      <div className="floating-orbs_christmas">
        <div className="orb_christmas orb-1_christmas"></div>
        <div className="orb_christmas orb-2_christmas"></div>
        <div className="orb_christmas orb-3_christmas"></div>
        <div className="orb_christmas orb-4_christmas"></div>
      </div>
      
      {/* Christmas Scene from new design */}
      <div className="christmas-scene">
        <div className="christmas-tree">
          <div className="tree-layer layer-1"></div>
          <div className="tree-layer layer-2"></div>
          <div className="tree-layer layer-3"></div>
          <div className="tree-trunk"></div>
          <div className="tree-star"></div>
          {[...Array(15)].map((_, i) => (
            <div key={i} className="tree-ornament"></div>
          ))}
        </div>
        
        <div className="snowman">
          <div className="snowman-bottom"></div>
          <div className="snowman-middle"></div>
          <div className="snowman-head"></div>
          <div className="snowman-hat"></div>
          <div className="snowman-scarf"></div>
          <div className="snowman-arms"></div>
        </div>
      </div>
      
      {/* Decorative Elements from old design */}
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
      
      <div className="slide-container">
        <div className="content-wrapper">
          <div className="ornament large-ornament"></div>
          <div className="ornament small-ornament"></div>
          <div className="ornament medium-ornament"></div>
          
          {/* Enhanced Title from old design */}
          <div className="header-section_christmas">
            <div className="decorative-line_christmas"></div>
            <h2 className="slide-title">
              <span className="title-part_christmas title-winter_christmas">Jingle</span>
              <span className="title-part_christmas title-festival_christmas">Joyce</span>
            </h2>
            <div className="decorative-line_christmas"></div>
          </div>
          
          <p className="slide-subtitle">
            ITS CHRISTMASSSSSSSSSS!!!!!!!!!!!!
          </p>
          
          {/* Gift Counter from old design */}
          <div className="gift-counter_christmas">
            <div className="counter-title_christmas">Sing it like her</div>
            <div class="img-crop-circle">
  <img src="https://achirastudio.github.io/Gallery/albums/christmas-charity/DSC05644.webp" alt="cropped" className="c-main-img" />
</div>
          </div>
          
          <div className="gift-boxes">
            <div className="gift-box box-1">
              <div className="gift-lid"></div>
              <div className="gift-bow"></div>
            </div>
            <div className="gift-box box-2">
              <div className="gift-lid"></div>
              <div className="gift-bow"></div>
            </div>
            <div className="gift-box box-3">
              <div className="gift-lid"></div>
              <div className="gift-bow"></div>
            </div>
          </div>
          
          
          {/* Enhanced Button from old design */}
          <button className="btn btn-christmas magnetic">
            <span className="btn-content">Join the Festivities</span>
            <div className="btn-sparkle"></div>
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
          </button>
        </div>
      </div>
      
      {/* Interactive Mouse Follower from old design */}
      <div className="cursor-glow_christmas"></div>
    </div>
    <Footer></Footer>
    </>
  );
};

// Slide 3 - Valentine Theme
export const Slide3 = () => {
  return (
    <div className="slide-content slide-3 slide-valentine">
      <div className="hearts-container">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="floating-heart"></div>
        ))}
      </div>
      
      <div className="rose-petals">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="rose-petal"></div>
        ))}
      </div>
      
      <div className="romantic-background">
        <div className="love-gradient"></div>
        <div className="sparkles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="sparkle"></div>
          ))}
        </div>
      </div>
      
      <div className="slide-container">
        <div className="content-wrapper">
          <div className="love-letter">
            <div className="letter-seal"></div>
            <div className="letter-content">
              <h2 className="slide-title">
                <span className="title-romantic">Spring Fling</span>
                <span className="title-dance">Dance Gala</span>
              </h2>
              
              <p className="slide-subtitle">
                An evening of romance, music, and unforgettable memories under the stars
              </p>
              
              <div className="couple-dance">
                <div className="dance-figure figure-1"></div>
                <div className="dance-figure figure-2"></div>
                <div className="dance-floor"></div>
              </div>
              
              {/* <div className="romantic-details">
                <div className="detail-rose">
                  <div className="rose"></div>
                  <span>Rose Ceremony</span>
                </div>
                <div className="detail-music">
                  <div className="music-note"></div>
                  <span>Live Orchestra</span>
                </div>
                <div className="detail-photo">
                  <div className="camera"></div>
                  <span>Photo Booth</span>
                </div>
                <div className="detail-champagne">
                  <div className="champagne-glass"></div>
                  <span>Toast to Love</span>
                </div>
              </div> */}
              
              <button className="btn btn-valentine magnetic">
                <span className="btn-content">Find Your Date</span>
                <div className="heart-pulse"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Slide 4 - Easter Theme
export const Slide4 = () => {
  return (
    <div className="slide-content slide-4 slide-easter">
      <div className="spring-garden">
        <div className="flower flower-1"></div>
        <div className="flower flower-2"></div>
        <div className="flower flower-3"></div>
        <div className="flower flower-4"></div>
        <div className="flower flower-5"></div>
        <div className="grass"></div>
        <div className="bush bush-1"></div>
        <div className="bush bush-2"></div>
      </div>
      
      <div className="floating-eggs">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="easter-egg"></div>
        ))}
      </div>
      
      <div className="easter-bunnies">
        <div className="bunny bunny-1">
          <div className="bunny-body"></div>
          <div className="bunny-head"></div>
          <div className="bunny-ears"></div>
          <div className="bunny-tail"></div>
        </div>
        <div className="bunny bunny-2">
          <div className="bunny-body"></div>
          <div className="bunny-head"></div>
          <div className="bunny-ears"></div>
          <div className="bunny-tail"></div>
        </div>
      </div>
      
      <div className="slide-container">
        <div className="content-wrapper">
          <div className="easter-basket">
            <div className="basket-handle"></div>
            <div className="basket-eggs">
              <div className="basket-egg"></div>
              <div className="basket-egg"></div>
              <div className="basket-egg"></div>
              <div className="basket-egg"></div>
            </div>
          </div>
          
          <h2 className="slide-title">
            <span className="title-spring">Easter Charity</span>
          </h2>
          
          <p className="slide-subtitle">
            Hop into spring with our colorful egg hunt, bunny visits, and family fun activities!
          </p>
          
          {/* <div className="easter-activities">
            <div className="activity">
              <div className="activity-icon">🐰</div>
              <h4>Bunny Meet & Greet</h4>
              <p>Photos with the Easter Bunny</p>
            </div>
            <div className="activity">
              <div className="activity-icon">🎨</div>
              <h4>Egg Decorating</h4>
              <p>Creative craft stations</p>
            </div>
            <div className="activity">
              <div className="activity-icon">🥚</div>
              <h4>Golden Egg Hunt</h4>
              <p>Special prizes hidden!</p>
            </div>
            <div className="activity">
              <div className="activity-icon">🧺</div>
              <h4>Basket Making</h4>
              <p>Create your own basket</p>
            </div>
          </div> */}
          
          <button className="btn btn-easter magnetic">
            <span className="btn-content">Join the Hunt</span>
            <div className="btn-carrot"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

// Slide 5 - Tournament Theme
export const Slide5 = () => {
  return (
    <>
    <div className="slide-content slide-5 slide-tournament">
      <div className="stadium-lights">
        <div className="light-beam"></div>
        <div className="light-beam"></div>
        <div className="light-beam"></div>
        <div className="light-beam"></div>
      </div>
      
      <div className="crowd-cheer">
        <div className="crowd-section"></div>
        <div className="crowd-section"></div>
        <div className="crowd-section"></div>
      </div>
      
      <div className="sports-equipment">
        <div className="basketball"></div>
        <div className="soccer-ball"></div>
        <div className="tennis-ball"></div>
        <div className="volleyball"></div>
      </div>
      
      <div className="team-mascots">
        <div className="mascot mascot-1">
          <div className="mascot-body"></div>
          <div className="mascot-head"></div>
        </div>
        <div className="mascot mascot-2">
          <div className="mascot-body"></div>
          <div className="mascot-head"></div>
        </div>
      </div>
      
      <div className="slide-container">
        <div className="content-wrapper">
          <div className="trophy-showcase">
            <div className="trophy-base"></div>
            <div className="trophy-cup"></div>
            <div className="trophy-glow"></div>
            <div className="medal medal-1"></div>
            <div className="medal medal-2"></div>
            <div className="medal medal-3"></div>
          </div>
          
          <h2 className="slide-title">
            <span className="title-championship">Regina Pacis</span>
            <span className="title-tournament">CUP</span>
          </h2>
          
          {/* <p className="slide-subtitle">
            Witness epic battles, record-breaking performances, and school spirit at its finest!
          </p> */}
          
          {/* <div className="scoreboard">
            <div className="scoreboard-header">
              <span className="team-name">HOME</span>
              <span className="vs">VS</span>
              <span className="team-name">AWAY</span>
            </div>
            <div className="scoreboard-scores">
              <span className="score home-score">78</span>
              <span className="score away-score">82</span>
            </div>
            <div className="scoreboard-timer">
              <span className="timer">Q4: 02:45</span>
            </div>
          </div>
          
          <div className="tournament-bracket">
            <div className="bracket-match">
              <div className="team vs-team">
                <span>Basketball Finals</span>
                <div className="vs-badge">VS</div>
              </div>
            </div>
            <div className="bracket-match">
              <div className="team vs-team">
                <span>Soccer Cup</span>
                <div className="vs-badge">VS</div>
              </div>
            </div>
            <div className="bracket-match">
              <div className="team vs-team">
                <span>Tennis Open</span>
                <div className="vs-badge">VS</div>
              </div>
            </div>
          </div>
          
          <div className="countdown-timer">
            <div className="timer-unit">
              <span className="number">14</span>
              <span className="label">Days</span>
            </div>
            <div className="timer-unit">
              <span className="number">08</span>
              <span className="label">Hours</span>
            </div>
            <div className="timer-unit">
              <span className="number">45</span>
              <span className="label">Minutes</span>
            </div>
            <div className="timer-unit">
              <span className="number">30</span>
              <span className="label">Seconds</span>
            </div>
          </div>
          
          <div className="tournament-actions">
            <button className="btn btn-tournament magnetic">
              <span className="btn-content">Register Team</span>
              <div className="btn-whistle"></div>
            </button>
            <button className="btn btn-spectator magnetic">
              <span className="btn-content">Get Tickets</span>
            </button>
          </div> */}
        </div>
      </div>
    </div>
    <Footer></Footer>
    </>
  );
};

// Slide 6 - End of Season Theme
export const Slide6 = () => {
  return (
    <div className="slide-content slide-6 slide-season">
      <div className="season-transition">
        <div className="autumn-leaf"></div>
        <div className="autumn-leaf"></div>
        <div className="autumn-leaf"></div>
        <div className="autumn-leaf"></div>
        <div className="autumn-leaf"></div>
        <div className="winter-flake"></div>
        <div className="winter-flake"></div>
        <div className="winter-flake"></div>
        <div className="winter-flake"></div>
        <div className="winter-flake"></div>
      </div>
      
      <div className="memory-wall">
        <div className="memory-photo"></div>
        <div className="memory-photo"></div>
        <div className="memory-photo"></div>
        <div className="memory-photo"></div>
        <div className="memory-photo"></div>
        <div className="memory-photo"></div>
      </div>
      
      <div className="confetti">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="confetti-piece"></div>
        ))}
      </div>
      
      <div className="slide-container">
        <div className="content-wrapper">
          <div className="yearbook-display">
            <div className="yearbook-cover">
              <div className="cover-title">Memories</div>
              <div className="cover-year">2024</div>
              <div className="cover-decoration"></div>
            </div>
            <div className="yearbook-pages">
              <div className="page-turning"></div>
              <div className="page-content">
                <div className="page-photo"></div>
                <div className="page-text"></div>
              </div>
            </div>
          </div>
          
          <h2 className="slide-title">
            <span className="title-farewell">Asencion</span>
          </h2>
          
          <p className="slide-subtitle">
            Suka dan duka kita lewati, kini saatnya kita menikmati
          </p>
          
          {/* <div className="achievement-showcase">
            <div className="achievement">
              <div className="achievement-badge badge-1"></div>
              <span>Academic Excellence</span>
            </div>
            <div className="achievement">
              <div className="achievement-badge badge-2"></div>
              <span>Sports Champions</span>
            </div>
            <div className="achievement">
              <div className="achievement-badge badge-3"></div>
              <span>Arts & Culture</span>
            </div>
            <div className="achievement">
              <div className="achievement-badge badge-4"></div>
              <span>Community Service</span>
            </div>
          </div>
          
          <div className="season-stats">
            <div className="stat">
              <div className="stat-number">150+</div>
              <div className="stat-label">Events Hosted</div>
            </div>
            <div className="stat">
              <div className="stat-number">95%</div>
              <div className="stat-label">Student Participation</div>
            </div>
            <div className="stat">
              <div className="stat-number">1K+</div>
              <div className="stat-label">Memories Made</div>
            </div>
            <div className="stat">
              <div className="stat-number">50+</div>
              <div className="stat-label">Awards Won</div>
            </div>
          </div> */}
          
          <button className="btn btn-season magnetic">
            <span className="btn-content">Relive the Memories</span>
            <div className="btn-memory"></div>
          </button>
        </div>
      </div>
    </div>
  );
};