import './slides.css';
import './slide-css/slide1.css'
import './slide-css/slide2.css'
import './slide-css/slide3.css'
import './slide-css/slide4.css'
import './slide-css/slide5.css'
import './slide-css/slide6.css'
import RandomQuote from './quotes.jsx';
import { Link } from 'react-router-dom';

function Slide1() {
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
                Welcome To <span className="gradient-text">RSHS</span>
              </h1>
              <div className="quotes">
                <RandomQuote></RandomQuote>
              </div>
              
              <div className="cta-buttons">
                <a href="#about" className="primary-btn">
                  <span className="btn-icon">👇</span> 
                  <span>Explore More</span>
                  <div className="hover-sparkle">✨</div>
                </a>
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
          
          {/* Interactive background particles */}
          <div className="particles">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="particle" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.5 + 0.3
              }}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Slide2() {
  return (
    <div
      className="slider slide-2"
      style={{
        background:
          'linear-gradient(rgba(0,0,0,0.2), url("https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")) center/cover',
      }}
    >
      <div className="slider-content christmas-theme">
        <div className="snowfall">
          <div className="snowflake">❄</div>
          <div className="snowflake">❅</div>
          <div className="snowflake">❆</div>
          <div className="snowflake">❄</div>
          <div className="snowflake">❅</div>
        </div>
        <div className="christmas-elements">
          <div className="gift gift-1">🎁</div>
          <div className="gift gift-2">🎁</div>
          <div className="snowman">⛄</div>
          <div className="christmas-tree">🎄</div>
        </div>
        <h1 className="christmas-title">Jingle Joyce &amp; Christmas Charity</h1>
        <p className="christmas-subtitle">Spread holiday cheer with our festive events!</p>
        <Link to="/Christmas"><div
          className="button-slider christmas-btn"
        >
          <span className="btn-text">Join the Fun!</span>
          <span className="santa-hat">🎅</span>
          <div className="sparkles">✨✨✨</div>
        </div></Link>
      </div>
    </div>
  );
}

function Slide3() {
  return (
    <div className="slider slide-3">
      <div className="slider-content">
        <div className="hearts">
          <div className="heart">❤</div>
          <div className="heart">❤</div>
          <div className="heart">❤</div>
          <div className="heart">❤</div>
          <div className="heart">❤</div>
        </div>
        <h1 className="valentine-title">Slither Sweetheart</h1>
        <p className="valentine-subtitle">Find your perfect match this Valentine's Day</p>
        <Link to="/Valentine">
        <div
          className="button-slider valentine-btn"
        >
          <h1>Take Me There! ❤</h1>
          <div className="heart-pulse" />
        </div>
        </Link>
      </div>
    </div>
  );
}

function Slide4() {
  return (
    <div className="slider slide-4">
      <div className="slider-content easter-theme">
        <div className="easter-fall">
          <div className="easter-flower">🌷</div>
          <div className="easter-flower">🌸</div>
          <div className="easter-flower">🌼</div>
          <div className="easter-flower">🌹</div>
          <div className="easter-flower">💐</div>
        </div>
        <div className="easter-elements">
          <div className="egg egg-1">🥚</div>
          <div className="egg egg-2">🥚</div>
          <div className="bunny">🐇</div>
          <div className="basket">🧺</div>
        </div>
        <h1 className="easter-title">Hop Into Spring!</h1>
        <p className="easter-subtitle">Join our egg-citing Easter events</p>
        <Link to="/Charity">
        <div
          className="button-slider easter-btn"
        >
          <span className="btn-text">Easter Charity</span>
          <span className="easter-icon">🐣</span>
          <div className="sparkles">✨✨✨</div>
        </div>
        </Link>
      </div>
    </div>
  );
}

function Slide5() {
  return (
    <div className="slider slide-open">
      <div className="slider-content recruit-theme">
        <div className="confetti">
          <div className="confetti-piece">🎉</div>
          <div className="confetti-piece">✨</div>
          <div className="confetti-piece">🎊</div>
          <div className="confetti-piece">🌟</div>
          <div className="confetti-piece">🥳</div>
        </div>
        <div className="recruit-elements">
          <div className="badge">🎖️</div>
          <div className="trophy">🏆</div>
          <div className="medal">🥇</div>
        </div>
        <h1 className="recruit-title">Join Our Team!</h1>
        <p className="recruit-subtitle">Exciting opportunities await new recruits</p>
        <div className="button-slider recruit-btn">
          <span className="btn-text" onClick={() => joinUs()}>
            Coming Soon
          </span>
          <span className="celebrate">🎯</span>
          <div className="sparkles">✨✨✨</div>
        </div>
      </div>
    </div>
  );
}

function Slide6() {
  return (
    <div className="slider slide-70rp">
      <div className="slider-content rp-theme">
        <div className="birthday-confetti">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 5 + 3}s`,
                animationDelay: `${Math.random() * 2}s`,
                fontSize: `${Math.random() * 1 + 1}rem`,
                color: `hsl(${Math.random() * 360}, 100%, 70%)`
              }}
            >
              {['🎉', '✨', '🎊', '🎈', '🥳'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
        <div className="birthday-elements">
          <div className="cake">🎂</div>
          <div className="gift">🎁</div>
          <div className="hat">🎓</div>
          <div className="number-70">70</div>
        </div>
        <h1 className="rp-title">HAPPY 70TH BIRTHDAY RP! 🎉</h1>
        <p className="rp-subtitle">Celebrating 70 years of excellence and memories</p>
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
  );
}

export { Slide1, Slide2, Slide3, Slide4, Slide5, Slide6 };