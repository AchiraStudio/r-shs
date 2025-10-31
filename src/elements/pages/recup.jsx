import { useState } from 'react';
import DynamicIsland from "../../rshs/Components/DynamicI";
import './css/recup.css';

function Recup() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('squad'); // 'squad' or 'individual'
    const [teamMembers, setTeamMembers] = useState(['']); // Initialize with one empty team member

    // Function to add a new team member
    const addTeamMember = () => {
        setTeamMembers([...teamMembers, '']);
    };

    // Function to update a team member's name
    const updateTeamMember = (index, value) => {
        const updatedMembers = [...teamMembers];
        updatedMembers[index] = value;
        setTeamMembers(updatedMembers);
    };

    // Function to remove a team member
    const removeTeamMember = (index) => {
        if (teamMembers.length > 1) {
            const updatedMembers = teamMembers.filter((_, i) => i !== index);
            setTeamMembers(updatedMembers);
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

                {/* Landing Page */}
                <section className="landing-ael">
                    <div className="title-greek-container">
                        <div className="accent-title-greek">
                            <h1>Welcome to</h1>
                        </div>
                        <div className="main-title-greek">
                            <img src="./assets/recup/title.png" alt="" />
                        </div>
                    </div>
                    <div className="middle-greek-container">
                        <div className="sunray-greek">
                            <img src="./assets/recup/sunray.png" alt="" />
                        </div>
                        <div className="building-greek-container">
                            <img src="./assets/recup/building.png" alt="" />
                        </div>
                    </div>
                    <div className="clouds-greek-container">
                        <div className="cloud-greek-left"><img src="./assets/recup/cloud.png" alt="" /></div>
                        <div className="cloud-greek-right"><img src="./assets/recup/cloud.png" alt="" /></div>
                    </div>
                    <div className="buttons-greek-container">
                        <div className="top-button-greek">
                            <button onClick={() => setIsModalOpen(true)}>Registration</button>
                            <button>Info Lomba</button>
                        </div>
                        <div className="bottom-button-greek">
                            <button>Guidebook</button>
                        </div>
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
                            <h2>Registration Form</h2>
                            <button
                                className="close-btn"
                                onClick={() => setIsModalOpen(false)}
                            >
                                ×
                            </button>
                        </div>

                        {/* Tab Navigation */}
                        <div className="tab-navigation">
                            <button
                                className={`tab-btn ${activeTab === 'squad' ? 'active' : ''}`}
                                onClick={() => setActiveTab('squad')}
                            >
                                Team Registration
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'individual' ? 'active' : ''}`}
                                onClick={() => setActiveTab('individual')}
                            >
                                Individual Registration
                            </button>
                        </div>

                        <div className="modal-content">
                            {/* Team Registration Form */}
                            {activeTab === 'squad' && (
                                <form className="registration-form">
                                    <div className="form-group">
                                        <label>Pilih Kompetisi</label>
                                        <div className="custom-dropdown">
                                            <select className="dropdown-select">
                                                <option value="">Select competition</option>
                                                <option value="volleyball">Volleyball</option>
                                                <option value="futsal">Futsal</option>
                                                <option value="basketball">Basketball</option>
                                                <option value="band">Band Competition</option>
                                                <option value="modern-dance">Modern Dance</option>
                                                <option value="esports">E-Sports</option>
                                                <option value="debate">Debate</option>
                                                <option value="cheerleading">Cheerleading</option>
                                            </select>
                                            <div className="dropdown-arrow">⌄</div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Nama Ketua Tim</label>
                                        <input
                                            type="text"
                                            className="glass-input"
                                            placeholder="Enter team leader's name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Anggota Tim</label>
                                        {teamMembers.map((member, index) => (
                                            <div key={index} className="team-member-input">
                                                <input
                                                    type="text"
                                                    className="glass-input"
                                                    placeholder={`Nama anggota tim ${index + 1}`}
                                                    value={member}
                                                    onChange={(e) => updateTeamMember(index, e.target.value)}
                                                />
                                                {teamMembers.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className="remove-member-btn"
                                                        onClick={() => removeTeamMember(index)}
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="add-member-btn"
                                            onClick={addTeamMember}
                                        >
                                            + Tambah Anggota
                                        </button>
                                    </div>

                                    <div className="form-group">
                                        <label>Asal Sekolah</label>
                                        <input
                                            type="text"
                                            className="glass-input"
                                            placeholder="Enter your school name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            className="glass-input"
                                            placeholder="Enter your email"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>No. WhatsApp</label>
                                        <input
                                            type="tel"
                                            className="glass-input"
                                            placeholder="Enter your WhatsApp number"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Surat Keterangan Sekolah</label>
                                        <input
                                            type="file"
                                            className="glass-input"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Pakta Integritas</label>
                                        <div className="checkbox-container">
                                            <input type="checkbox" id="integrity-pact" />
                                            <label htmlFor="integrity-pact">Saya menyatakan bahwa data yang saya berikan adalah benar</label>
                                        </div>
                                    </div>

                                    <button type="submit" className="submit-btn glass-effect">
                                        Submit Team Registration
                                    </button>
                                </form>
                            )}

                            {/* Individual Registration Form */}
                            {activeTab === 'individual' && (
                                <form className="registration-form">
                                    <div className="form-group">
                                        <label>Pilih Kompetisi</label>
                                        <div className="custom-dropdown">
                                            <select className="dropdown-select">
                                                <option value="">Select competition</option>
                                                <option value="volleyball">Volleyball</option>
                                                <option value="futsal">Futsal</option>
                                                <option value="basketball">Basketball</option>
                                                <option value="band">Band Competition</option>
                                                <option value="modern-dance">Modern Dance</option>
                                                <option value="esports">E-Sports</option>
                                                <option value="debate">Debate</option>
                                                <option value="cheerleading">Cheerleading</option>
                                            </select>
                                            <div className="dropdown-arrow">⌄</div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Nama</label>
                                        <input
                                            type="text"
                                            className="glass-input"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Asal Sekolah</label>
                                        <input
                                            type="text"
                                            className="glass-input"
                                            placeholder="Enter your school name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            className="glass-input"
                                            placeholder="Enter your email"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>No. WhatsApp</label>
                                        <input
                                            type="tel"
                                            className="glass-input"
                                            placeholder="Enter your WhatsApp number"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Surat Keterangan Sekolah</label>
                                        <input
                                            type="file"
                                            className="glass-input"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Pakta Integritas</label>
                                        <div className="checkbox-container">
                                            <input type="checkbox" id="integrity-pact-individual" />
                                            <label htmlFor="integrity-pact-individual">Saya menyatakan bahwa data yang saya berikan adalah benar</label>
                                        </div>
                                    </div>

                                    <button type="submit" className="submit-btn glass-effect">
                                        Submit Individual Registration
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Recup;