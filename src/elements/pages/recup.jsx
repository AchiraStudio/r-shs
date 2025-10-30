import { useState, useEffect } from 'react';
import DynamicIsland from "../../rshs/Components/DynamicI";
import CompetitionApi from '../../api/recup.js';
import './css/recup.css';

function Recup() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [competitions, setCompetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        img: '',
        recent_quota: 0
    });

    // Fetch competitions on component mount
    useEffect(() => {
        fetchCompetitions();
    }, []);

    const fetchCompetitions = async () => {
        try {
            setLoading(true);
            const comps = await CompetitionApi.getAllCompetitions();
            setCompetitions(comps);
            setError(null);
        } catch (err) {
            setError('Failed to load competitions');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await CompetitionApi.createCompetition(formData);
            // Refresh the competitions list
            await fetchCompetitions();
            // Reset form and close modal
            setFormData({
                title: '',
                description: '',
                img: '',
                recent_quota: 0
            });
            setIsModalOpen(false);
            alert('Competition created successfully!');
        } catch (err) {
            alert('Failed to create competition');
            console.error('Error:', err);
        }
    };

    const handleDeleteCompetition = async (id) => {
        if (window.confirm('Are you sure you want to delete this competition?')) {
            try {
                await CompetitionApi.deleteCompetition(id);
                await fetchCompetitions();
                alert('Competition deleted successfully!');
            } catch (err) {
                alert('Failed to delete competition');
                console.error('Error:', err);
            }
        }
    };

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
                            <span className="title-main">Inter-School</span>
                            <span className="title-accent">Sports Championship</span>
                        </h1>
                        
                        <p className="hero-description">
                            Join the ultimate sports competition where schools compete for glory. 
                            Showcase your talent, build teamwork, and create unforgettable memories.
                        </p>
                        
                        <div className="cta-section">
                            <button 
                                className="register-btn glass-effect"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <span className="btn-text">Create Competition</span>
                                <div className="btn-shine"></div>
                            </button>
                            
                            <div className="stats-container">
                                <div className="stat-item">
                                    <span className="stat-number">{competitions.length}+</span>
                                    <span className="stat-label">Competitions</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">15</span>
                                    <span className="stat-label">Sports</span>
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

                {/* Competitions Section */}
                <section className="competitions-section">
                    <h2 className="section-title">Current Competitions</h2>
                    
                    {loading && <div className="loading">Loading competitions...</div>}
                    
                    {error && (
                        <div className="error-message">
                            {error}
                            <button onClick={fetchCompetitions} className="retry-btn">
                                Retry
                            </button>
                        </div>
                    )}
                    
                    {!loading && !error && (
                        <div className="competitions-grid">
                            {competitions.length === 0 ? (
                                <div className="no-competitions">
                                    No competitions yet. Create the first one!
                                </div>
                            ) : (
                                competitions.map(competition => (
                                    <div key={competition.id} className="competition-card glass-effect">
                                        {competition.img && (
                                            <img 
                                                src={competition.img} 
                                                alt={competition.title}
                                                className="competition-image"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        )}
                                        <div className="competition-content">
                                            <h3>{competition.title}</h3>
                                            <p>{competition.description}</p>
                                            <div className="competition-meta">
                                                <span className="quota">
                                                    Quota: {competition.recent_quota}
                                                </span>
                                            </div>
                                            <button 
                                                onClick={() => handleDeleteCompetition(competition.id)}
                                                className="delete-btn"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </section>

                {/* Features Section */}
                <section className="features-section">
                    <div className="features-grid">
                        <div className="feature-card glass-effect">
                            <div className="feature-icon">🏆</div>
                            <h3>Championship Glory</h3>
                            <p>Compete for the prestigious Recis Cup trophy and eternal bragging rights</p>
                        </div>
                        
                        <div className="feature-card glass-effect">
                            <div className="feature-icon">⚡</div>
                            <h3>Multiple Sports</h3>
                            <p>Basketball, Football, Athletics, Swimming and many more exciting sports</p>
                        </div>
                        
                        <div className="feature-card glass-effect">
                            <div className="feature-icon">🤝</div>
                            <h3>School Spirit</h3>
                            <p>Build camaraderie and showcase your school's talent and sportsmanship</p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Create Competition Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="registration-modal glass-effect">
                        <div className="modal-header">
                            <h2>Create New Competition</h2>
                            <button 
                                className="close-btn"
                                onClick={() => setIsModalOpen(false)}
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="modal-content">
                            <form className="registration-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Competition Title *</label>
                                    <input 
                                        type="text" 
                                        name="title"
                                        className="glass-input"
                                        placeholder="Enter competition title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea 
                                        name="description"
                                        className="glass-input"
                                        placeholder="Enter competition description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                    />
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Image URL</label>
                                        <input 
                                            type="url" 
                                            name="img"
                                            className="glass-input"
                                            placeholder="https://example.com/image.jpg"
                                            value={formData.img}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Participant Quota</label>
                                        <input 
                                            type="number" 
                                            name="recent_quota"
                                            className="glass-input"
                                            placeholder="Enter participant quota"
                                            value={formData.recent_quota}
                                            onChange={handleInputChange}
                                            min="0"
                                        />
                                    </div>
                                </div>
                                
                                <button type="submit" className="submit-btn glass-effect">
                                    Create Competition
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