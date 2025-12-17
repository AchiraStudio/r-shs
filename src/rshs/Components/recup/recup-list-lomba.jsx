import React, { useState } from 'react';
import './css/list-lomba.css';

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdlOBaqKPofTeWQV_mXpp1mxzLJFpX17ZyjLZzl8jV59ADqcg/viewform";

const RecupCompetitions = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const competitions = [
    {
      id: 1,
      title: "Basket",
      category: "sports",
      description: "Kompetisi basket untuk tim putra dan putri tingkat pelajar.",
      image: "./assets/recup/comps/basket.jpg",
      date: "Hari ke-1",
      participants: "Tim",
      fee: "Rp 50.000 / tim"
    },
    {
      id: 2,
      title: "Futsal (SMP & SMA)",
      category: "sports",
      description: "Turnamen futsal untuk siswa SMP dan SMA.",
      image: "./assets/recup/comps/futsal.jpg",
      date: "Hari ke-2",
      participants: "Tim",
      fee: "Rp 75.000 / tim"
    },
    {
      id: 3,
      title: "Voli",
      category: "sports",
      description: "Lomba voli antar tim pelajar putra dan putri.",
      image: "./assets/recup/comps/voli.jpg",
      date: "Hari ke-2",
      participants: "Tim",
      fee: "Rp 50.000 / tim"
    },
    {
      id: 4,
      title: "Modern Dance",
      category: "arts",
      description: "Tunjukkan kreativitas dan kekompakan melalui tarian modern.",
      image: "./assets/recup/comps/md.jpg",
      date: "Hari ke-1",
      participants: "Grup",
      fee: "Rp 40.000 / grup"
    },
    {
      id: 5,
      title: "E-Sport (Mobile Legends)",
      category: "sports",
      description: "Turnamen Mobile Legends untuk tim pelajar.",
      image: "./assets/recup/comps/mole.jpeg",
      date: "Hari ke-3",
      participants: "Tim (5 orang)",
      fee: "Rp 100.000 / tim"
    },
    {
      id: 6,
      title: "Band",
      category: "arts",
      description: "Kompetisi band untuk menampilkan bakat bermusik.",
      image: "./assets/recup/comps/band.jpg",
      date: "Hari ke-1",
      participants: "Grup",
      fee: "Rp 50.000 / band"
    },
    {
      id: 7,
      title: "Film Pendek",
      category: "arts",
      description: "Lomba film pendek dengan tema bebas dan kreatif.",
      image: "./assets/recup/comps/sfilm.jpg",
      date: "Hari ke-3",
      participants: "Tim",
      fee: "Rp 30.000 / tim"
    },
    {
      id: 8,
      title: "KIR IPA",
      category: "academic",
      description: "Kompetisi karya ilmiah remaja bidang IPA.",
      image: "./assets/recup/comps/kir.jpg",
      date: "Hari ke-2",
      participants: "Tim",
      fee: "Rp 25.000 / tim"
    },
    {
      id: 9,
      title: "Debat Bahasa Inggris",
      category: "academic",
      description: "Lomba debat Bahasa Inggris untuk melatih berpikir kritis.",
      image: "./assets/recup/comps/debate.jpg",
      date: "Hari ke-3",
      participants: "Tim (3 orang)",
      fee: "Rp 30.000 / tim"
    }
  ];

  const categories = [
    { id: 'all', name: 'Semua Lomba' },
    { id: 'sports', name: 'Olahraga' },
    { id: 'academic', name: 'Akademik' },
    { id: 'arts', name: 'Seni' }
  ];

  const filteredCompetitions =
    activeCategory === 'all'
      ? competitions
      : competitions.filter(c => c.category === activeCategory);

  return (
    <section className="competitions-section">
      <div className="ancient-scroll-container">
        <div className="scroll-overlay"></div>
        <div className="scroll-texture"></div>

        <div className="competitions-container">
          <div className="section-header">
            <h2 className="section-title">Daftar Perlombaan</h2>
            <div className="title-decoration">
              <span className="greek-symbol">Σ</span>
            </div>
          </div>

          <div className="category-tabs">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="competitions-grid">
            {filteredCompetitions.map(comp => (
              <div key={comp.id} className="competition-card ancient-paper">
                <div className="competition-image-container">
                  <img
                    src={comp.image}
                    alt={comp.title}
                    className="competition-image"
                  />
                  <div className="competition-category-badge">
                    {categories.find(c => c.id === comp.category)?.name}
                  </div>
                </div>

                <div className="competition-content">
                  <h3 className="competition-title">{comp.title}</h3>
                  <p className="competition-description">{comp.description}</p>

                  <div className="competition-details">
                    {/* <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <span>{comp.date}</span>
                    </div> */}
                    <div className="detail-item">
                      <span className="detail-icon">👥</span>
                      <span>{comp.participants}</span>
                    </div>
                    {/* <div className="detail-item">
                      <span className="detail-icon">💰</span>
                      <span>{comp.fee}</span>
                    </div> */}
                  </div>

                  <a
                    href={FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="competition-button"
                  >
                    Daftar Sekarang
                  </a>
                </div>

                <div className="competition-decoration">
                  <span className="greek-symbol">Δ</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecupCompetitions;
