import { useState } from 'react';
import DynamicIsland from "../../rshs/Components/DynamicI";
import './css/recup.css';

function Recup() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <DynamicIsland />
            
            {/* Main Landing Page */}
            <div className="recup-container">
                {/* Animated Background Elements */}
                <div className="liquid-bg">
                    <div className="liquid-shape shape-1"></div>
                    <div className="liquid-shape shape-2"></div>
                    <div className="liquid-shape shape-3"></div>
                    <div className="liquid-shape shape-4"></div>
                </div>

                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-content">
                        <div className="logo-container">
                            <div className="glass-logo">
                                <span className="logo-text">RECIS CUP</span>
                            </div>
                        </div>
                        
                        <h1 className="hero-title">
                            <span className="title-main">Compete</span>
                            <span className="title-accent-sec">Win</span>
                            <span className="title-accent-third">Celebrate</span>
                        </h1>
                        
                        <p className="hero-description">
                            BAHLIL DONGO, GW BELI BENSIN ISI APAAAAA
                        </p>
                        
                        <div className="cta-section">
                            <button 
                                className="register-btn glass-effect"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <span className="btn-text">Register Your School</span>
                                <div className="btn-shine"></div>
                            </button>
                            
                            <div className="stats-container">
                                <div className="stat-item">
                                    <span className="stat-number">-</span>
                                    <span className="stat-label">Schools</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">8</span>
                                    <span className="stat-label">Competitions</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">1</span>
                                    <span className="stat-label">Champion</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Sports Visual */}
                    <div className="sports-visual">
                        <div className="floating-element athlete"></div>
                        <div className="floating-element ball"></div>
                        <div className="floating-element trophy"></div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="features-section">
                    <div className="features-grid">
                        <div className="feature-card glass-effect">
                            <div className="feature-icon">🏆</div>
                            <h3>Championship Glory</h3>
                            <p>Bertarung, berjuang, mendapatkan mahkota RECIS</p>
                        </div>
                        
                        <div className="feature-card glass-effect">
                            <div className="feature-icon">⚡</div>
                            <h3>Multiple Competitions</h3>
                            <p>Volley, Futsal, Band, Modern Dance dan masih banyak lagi!</p>
                        </div>
                        
                        <div className="feature-card glass-effect">
                            <div className="feature-icon">🤝</div>
                            <h3>Sportmanship</h3>
                            <p>"They are your opponent, not your enemy"</p>
                        </div>
                    </div>
                </section>
                {/* Gallery */}
                <section className="gallery-section"></section>
            </div>

            {/* Registration Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="registration-modal glass-effect">
                        <div className="modal-header">
                            <h2>Register Your Squad</h2>
                            <button 
                                className="close-btn"
                                onClick={() => setIsModalOpen(false)}
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="modal-content">
                            <form className="registration-form">
                                <div className="form-group">
                                    <label>School Name</label>
                                    <input 
                                        type="text" 
                                        className="glass-input"
                                        placeholder="Enter your school name"
                                    />
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Contact Person</label>
                                        <input 
                                            type="text" 
                                            className="glass-input"
                                            placeholder="Full name"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input 
                                            type="tel" 
                                            className="glass-input"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input 
                                        type="email" 
                                        className="glass-input"
                                        placeholder="contact@school.edu"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Sports Interested In</label>
                                    <div className="sports-selection">
                                        {['Basketball', 'Football', 'Athletics', 'Swimming', 'Volleyball', 'Tennis'].map(sport => (
                                            <label key={sport} className="sport-option">
                                                <input type="checkbox" />
                                                <span className="checkmark"></span>
                                                {sport}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                
                                <button type="submit" className="submit-btn glass-effect">
                                    Submit Registration
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Recup;