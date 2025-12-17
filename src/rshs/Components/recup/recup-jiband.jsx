import React from 'react';
import './css/jiband.css';

const RecupGuestStar = () => {
  const guestStars = [
    {
      id: 1,
      name: "Renata",
      title: "Singer",
      image: "./assets/recup/renata.jpg",
      description: "@renatavv",
      symbol: "α"
    },
    {
      id: 2,
      name: "Joshua",
      title: "Kibordis",
      image: "./assets/recup/joshua.jpg",
      description: "@joshua_hatusupy",
      symbol: "β"
    },
    {
      id: 3,
      name: "Lintang",
      title: "Drummer",
      image: "./assets/recup/lintang.jpg",
      description: "@nicholaslintangg",
      symbol: "γ"
    },
    {
      id: 4,
      name: "Levi",
      title: "Gitaris",
      image: "./assets/recup/levi.png",
      description: "@lekanevv",
      symbol: "δ"
    },
    {
      id: 5,
      name: "Jairo",
      title: "Gitaris",
      image: "./assets/recup/jairo.png",
      description: "@jairojiben_",
      symbol: "ε"
    },
    {
      id: 6,
      name: "Jojosh",
      title: "Bassis",
      image: "./assets/recup/jojosh.png",
      description: "@josh.sopamena",
      symbol: "ζ"
    }
  ];

  return (
    <section className="guest-star-section">
      <div className="ancient-scroll-container">
        <div className="scroll-overlay"></div>
        <div className="scroll-texture"></div>
        
        <div className="guest-star-container">
          {/* Main Band Card - Enhanced */}
          <div className="main-band-card ancient-paper">
            <div className="band-header">
              <div className="band-symbols">
                <span className="greek-symbol-large">μ</span>
                <span className="greek-symbol-large">ν</span>
              </div>
              <h1 className="band-title">JIBAND</h1>
              <div className="band-symbols">
                <span className="greek-symbol-large">ξ</span>
                <span className="greek-symbol-large">ο</span>
              </div>
            </div>
            
            <div className="band-content">
              <div className="band-image-wrapper">
                <div className="band-image-frame">
                  <img 
                    src="./assets/recup/jiband.jpg" 
                    alt="Jiband" 
                    className="band-image" 
                  />
                  <div className="frame-decoration"></div>
                </div>
                <div className="band-motto">
                  <span className="motto-text">JIBAND</span>
                  <span className="motto-symbol">!</span>
                </div>
              </div>
              
              <div className="band-info">
                <div className="band-description">
                  <p className="band-tagline">The main act!</p>
                </div>
                
                <div className="band-social">
                  <span className="social-handle">@jiband_</span>
                </div>
              </div>
            </div>
            
            <div className="band-footer">
              <div className="divider">
                <span className="divider-symbol">✦</span>
                <span className="divider-line"></span>
                <span className="divider-symbol">✦</span>
              </div>
              <h2 className="guest-stars-title">Featured Guest Stars</h2>
            </div>
          </div>
          
          {/* Guest Stars Grid */}
          <div className="guest-stars-grid">
            {guestStars.map(guest => (
              <div key={guest.id} className="guest-card ancient-paper">
                <div className="guest-card-header">
                  <span className="guest-symbol">{guest.symbol}</span>
                  <div className="guest-role">
                    <span className="role-icon">
                      {guest.title.includes('Singer') ? '🎤' : 
                       guest.title.includes('Drummer') ? '🥁' : 
                       guest.title.includes('Gitaris') ? '🎸' : 
                       guest.title.includes('Bassis') ? '🎸' : 
                       guest.title.includes('Kibordis') ? '🎹' : '🎵'}
                    </span>
                  </div>
                </div>
                
                <div className="guest-image-container">
                  <img src={guest.image} alt={guest.name} className="guest-image" />
                  <div className="image-frame"></div>
                  <div className="image-glow"></div>
                </div>
                
                <div className="guest-info">
                  <h3 className="guest-name">{guest.name}</h3>
                  <p className="guest-title">{guest.title}</p>
                  <div className="guest-social">
                    <span className="social-icon">@</span>
                    <p className="guest-description">{guest.description}</p>
                  </div>
                </div>
                
                <div className="guest-decoration">
                  <div className="decoration-line"></div>
                  <span className="greek-symbol-small">{guest.symbol}</span>
                  <div className="decoration-line"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecupGuestStar;