import React from 'react';
import './css/jiband.css';

const RecupGuestStar = () => {
  const guestStars = [
    {
      id: 1,
      name: "Renata",
      title: "Singer",
      image: "./assets/recup/renata.jpg",
      description: "@renatavv"
    },
    {
      id: 2,
      name: "Joshua",
      title: "Kibordis",
      image: "./assets/recup/joshua.jpg",
      description: "@joshua_hatusupy"
    },
    {
      id: 3,
      name: "Lintang",
      title: "Drummer",
      image: "./assets/recup/lintang.jpg",
      description: "@nicholaslintangg"
    },
    {
      id: 4,
      name: "Levi",
      title: "Gitaris",
      image: "./assets/recup/levi.png",
      description: "@lekanevv"
    },
    {
      id: 5,
      name: "Jairo",
      title: "Gitaris",
      image: "./assets/recup/jairo.png",
      description: "@jairojiben_"
    },
    {
      id: 6,
      name: "Jojosh",
      title: "Bassis",
      image: "./assets/recup/jojosh.png",
      description: "@josh.sopamena"
    }
  ];

  return (
    <section className="guest-star-section">
      <div className="ancient-scroll-container">
        <div className="scroll-overlay"></div>
        <div className="scroll-texture"></div>
        
        <div className="guest-star-container">
          <div className="section-header">
            <h2 className="section-title">Guest Stars</h2>
            <div className="title-decoration">
              <span className="greek-symbol">
                <div className="guest-card ancient-paper jiband">
                  <div className="guest-image-container">
                    <img src="./assets/recup/jiband.jpg" className="guest-image" />
                    <div className="image-frame"></div>
                  </div>
                  <div className="guest-info">
                    <h3 className="guest-name">Jiband</h3>
                  </div>
              </div>
              </span>
            </div>
          </div>
          
          <div className="guest-stars-grid">
            {guestStars.map(guest => (
              <div key={guest.id} className="guest-card ancient-paper">
                <div className="guest-image-container">
                  <img src={guest.image} alt={guest.name} className="guest-image" />
                  <div className="image-frame"></div>
                </div>
                <div className="guest-info">
                  <h3 className="guest-name">{guest.name}</h3>
                  <p className="guest-title">{guest.title}</p>
                  <p className="guest-description">{guest.description}</p>
                </div>
                <div className="guest-decoration">
                  <span className="greek-symbol">α</span>
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