import React, { useState } from 'react';
import './css/tulus.css';

const RecupSpecialPerformance = () => {
  const [activePerformance, setActivePerformance] = useState(0);

  const performances = [
  {
    id: 1,
    title: "Main Performance",
    time: "Beberapa Fun Fact mengenai Tulus",
    location: "Main Stadium",
    description: "TULUS dikenal sebagai musisi independen dengan lebih dari 10 juta pendengar bulanan di Spotify dan konser yang hampir selalu sold out di berbagai kota besar Indonesia.",
    image: "https://cms.disway.id/uploads/9ea2e21fa794b8bf8cc7f1f668f3440f.png"
  },
  {
    id: 2,
    title: "About Tulus",
    time: "Beberapa Fun Fact mengenai Tulus",
    location: "Amphitheater",
    description: "Muhammad Tulus Rusydi atau TULUS, lahir 20 Agustus 1987 di Bukittinggi. Lulusan Arsitektur ITB ini telah merilis 4 album studio dan menulis hampir seluruh lagunya sendiri melalui label independen TulusCompany.",
    image: "https://media.suara.com/pictures/970x544/2022/03/17/39060-tulus-instagramattulusm.jpg"
  },
  {
    id: 3,
    title: "Lagu Populer",
    time: "Tulus Top 5 Songs",
    location: "Central Plaza",
    description: "Top 5 lagu TULUS berdasarkan streaming Spotify: Monokrom (±550 juta), Hati-Hati di Jalan (±470 juta), Interaksi (±390 juta), Langit Abu-Abu (±290 juta), dan Diri (±220 juta).",
    image: "https://s.mxmcdn.net/community-dynamic-images/community/lyrics?options=eyJkZXRhaWxzIjoiTGVtYmFyYW4gZm90byBoaXRhbS1wdXRpaFxuQWt1IGNvYmEgaW5nYXQgbGFnaSB3YXJuYSBiYWp1bXUga2FsYSBpdHVcbkthbGkgcGVydGFtYSBkaSBoaWR1cGt1XG5NYW51c2lhIGxhaW4gbWVtZWx1a2t1XG4iLCJsb2dvIjoiaHR0cHM6Ly9zLm14bWNkbi5uZXQvaW1hZ2VzLXN0b3JhZ2UvYWxidW1zMi80LzEvMC83LzUvMC8zNTA1NzAxNF81MDBfNTAwLmpwZyIsIm5hbWUiOiJUdWx1cyIsInRpdGxlIjoiTW9ub2tyb20ifQ%3D%3D&imageFormat=jpeg&signature=w0bVOmt4l2pCmqZfs%2BODt3h6%2BRXgz1XCWH9dmDtB7xI&signature_protocol=sha256"
  },
  {
    id: 4,
    title: "Career Highlights",
    time: "2011 – Sekarang",
    location: "Concert Hall",
    description: "Debut tahun 2011, TULUS telah meraih puluhan penghargaan musik, merilis album Manusia (2022) yang memecahkan rekor streaming, serta menggelar tur konser nasional dan internasional dengan puluhan ribu penonton.",
    image: "https://cdn.antaranews.com/cache/1200x800/2022/12/01/Spotify-Wrapped-2022-Tulus_1.png"
  }
  ];

  const handlePerformanceChange = (index) => {
    setActivePerformance(index);
  };

  return (
    <section className="special-performance-section" id='guest-star'>
      <div className="ancient-scroll-container">
        <div className="scroll-overlay"></div>
        <div className="scroll-texture"></div>
        
        <div className="performance-container">
          <div className="section-header">
            <h2 className="section-title">MEET OUR STAR THIS YEAR</h2>
            <div className="title-decoration">
              <span className="greek-symbol">TULUS</span>
            </div>
          </div>
          
          <div className="performance-showcase">
            <div className="performance-main">
              <div className="performance-image-container">
                <img 
                  src={performances[activePerformance].image} 
                  alt={performances[activePerformance].title} 
                  className="performance-image" 
                />
                <div className="image-overlay">
                  <div className="performance-time">
                    <span className="time-icon">⏰</span>
                    {performances[activePerformance].time}
                  </div>
                  <div className="performance-location">
                    <span className="location-icon">📍</span>
                    {performances[activePerformance].location}
                  </div>
                </div>
              </div>
              
              <div className="performance-details ancient-paper">
                <h3 className="performance-title">{performances[activePerformance].title}</h3>
                <p className="performance-description">{performances[activePerformance].description}</p>
                <button className="performance-button">Reserve Seat</button>
              </div>
            </div>
            
            <div className="performance-selector">
              {performances.map((performance, index) => (
                <div 
                  key={performance.id} 
                  className={`performance-item ${index === activePerformance ? 'active' : ''}`}
                  onClick={() => handlePerformanceChange(index)}
                >
                  <div className="performance-thumbnail">
                    <img src={performance.image} alt={performance.title} />
                  </div>
                  <div className="performance-info">
                    <h4 className="performance-name">{performance.title}</h4>
                    <p className="performance-time-small">{performance.time}</p>
                  </div>
                  <div className="performance-indicator">
                    <span className="greek-symbol">ψ</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecupSpecialPerformance;