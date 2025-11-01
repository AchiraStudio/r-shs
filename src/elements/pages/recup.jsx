import { useState } from 'react';
import DynamicIsland from "../../rshs/Components/DynamicI";
import './css/recup.css';
import './css/dynamic-greek.css'

function Recup() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('squad'); // 'squad' or 'individual'
  const [teamMembers, setTeamMembers] = useState(['']); // Initialize with one empty team member

  // Add, update, and remove team members
  const addTeamMember = () => setTeamMembers([...teamMembers, '']);
  const updateTeamMember = (index, value) => {
    const updated = [...teamMembers];
    updated[index] = value;
    setTeamMembers(updated);
  };
  const removeTeamMember = (index) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter((_, i) => i !== index));
    }
  };

  // Form submission handlers
  const handleTeamSubmit = (e) => {
    e.preventDefault();
    // Handle team registration logic here
    console.log('Team registration submitted');
    setIsModalOpen(false);
  };

  const handleIndividualSubmit = (e) => {
    e.preventDefault();
    // Handle individual registration logic here
    console.log('Individual registration submitted');
    setIsModalOpen(false);
  };

  return (
    <>
      {/* 🏛 Dynamic Island with Greek Theme */}
      <DynamicIsland className="greek" />

      {/* Main Landing Page */}
      <div className="recup-container">
        {/* Animated Background */}
        <div className="liquid-bg">
          <div className="liquid-shape shape-1"></div>
          <div className="liquid-shape shape-2"></div>
          <div className="liquid-shape shape-3"></div>
          <div className="liquid-shape shape-4"></div>
        </div>

        {/* Landing Section */}
        <section className="landing-ael">
          <div className="sunray-overlay">
            <img src="./assets/recup/overlay.png" alt="Sunray Overlay" />
          </div>

          <div className="title-greek-container">
            <div className="main-title-greek">
              <img src="./assets/recup/title.png" alt="Event Title" />
            </div>
          </div>

          <div className="middle-greek-container">
            <div className="sunray-greek">
              <img src="./assets/recup/sunray.png" alt="Sunray" className="spin" />
            </div>
            <div className="building-greek-container">
              <img src="./assets/recup/building.png" alt="Greek Building" />
            </div>
          </div>

          <div className="clouds-greek-container">
            <div className="cloud-greek-left">
              <img src="./assets/recup/cloud.png" alt="Cloud Left" />
            </div>
            <div className="cloud-greek-right">
              <img src="./assets/recup/cloud.png" alt="Cloud Right" />
            </div>
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

        {/* Competition Section */}
        <section className="competition-section">
          <div className="ancient-scroll-container">
            {/* Ancient Paper Scroll Background */}
            <div className="scroll-overlay"></div>
            <div className="scroll-texture"></div>

            {/* Grid Container */}
            <div className="features-grid">
              
              {/* Row 1: Left - 2 small boxes | Right - 1 large box */}
              <div className="grid-row">
                <div className="left-column">
                  <div className="small-box ancient-paper">
                    <div className="box-content">
                      <h3 className="box-title">Oracle's Insight</h3>
                      <p className="box-description">Seek wisdom from the Delphi Oracle, where ancient prophecies guide modern decisions.</p>
                      <div className="greek-symbol">🔮</div>
                    </div>
                  </div>
                  <div className="small-box ancient-paper">
                    <div className="box-content">
                      <h3 className="box-title">Athena's Strategy</h3>
                      <p className="box-description">Embrace wisdom and tactical thinking in your daily challenges and conquests.</p>
                      <div className="greek-symbol">🦉</div>
                    </div>
                  </div>
                </div>
                
                <div className="large-box ancient-paper">
                  <div className="box-content">
                    <h3 className="box-title">Zeus' Dominion</h3>
                    <p className="box-description">Rule with the authority and power of the sky father, commanding respect and order across all domains of your endeavors.</p>
                    <div className="greek-symbol-large">⚡</div>
                  </div>
                </div>
              </div>

              {/* Row 2: Left - 1 large box | Right - 2 small boxes */}
              <div className="grid-row">
                <div className="large-box ancient-paper">
                  <div className="box-content">
                    <h3 className="box-title">Poseidon's Realm</h3>
                    <p className="box-description">Navigate the depths of opportunity with the trident's power, creating waves of change and commanding the seas of innovation.</p>
                    <div className="greek-symbol-large">🌊</div>
                  </div>
                </div>
                
                <div className="right-column">
                  <div className="small-box ancient-paper">
                    <div className="box-content">
                      <h3 className="box-title">Hermes' Speed</h3>
                      <p className="box-description">Move with the swiftness of the messenger god, delivering results with unparalleled efficiency.</p>
                      <div className="greek-symbol">👟</div>
                    </div>
                  </div>
                  <div className="small-box ancient-paper">
                    <div className="box-content">
                      <h3 className="box-title">Apollo's Arts</h3>
                      <p className="box-description">Create with the divine inspiration of music, poetry, and healing arts.</p>
                      <div className="greek-symbol">🎭</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: 2 large boxes */}
              <div className="grid-row">
                <div className="large-box ancient-paper">
                  <div className="box-content">
                    <h3 className="box-title">Hephaestus' Craft</h3>
                    <p className="box-description">Forge masterpieces with divine craftsmanship, turning raw materials into works of legendary quality and durability.</p>
                    <div className="greek-symbol-large">⚒️</div>
                  </div>
                </div>
                <div className="large-box ancient-paper">
                  <div className="box-content">
                    <h3 className="box-title">Ares' Valor</h3>
                    <p className="box-description">Face challenges with the courage and strategic might of the war god, turning conflicts into victories.</p>
                    <div className="greek-symbol-large">🛡️</div>
                  </div>
                </div>
              </div>

              {/* Row 4: Single large box */}
              <div className="grid-row-center">
                <div className="single-large-box ancient-paper">
                  <div className="box-content">
                    <h3 className="center-title">Mount Olympus Legacy</h3>
                    <p className="center-description">Ascend to the pantheon of greatness by uniting all divine attributes. This sacred knowledge, preserved on ancient scrolls, represents the culmination of twelve generations of wisdom from the gods themselves.</p>
                    <div className="olympus-symbol">🏛️</div>
                    <div className="scroll-ribbon"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="gallery-section"></section>
      </div>

      {/* 🧾 Registration Modal */}
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
              {/* === Team Registration Form === */}
              {activeTab === 'squad' && (
                <form className="registration-form" onSubmit={handleTeamSubmit}>
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
                      required
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
                          required
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
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      className="glass-input"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>No. WhatsApp</label>
                    <input
                      type="tel"
                      className="glass-input"
                      placeholder="Enter your WhatsApp number"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Surat Keterangan Sekolah</label>
                    <input
                      type="file"
                      className="glass-input"
                      accept=".pdf,.jpg,.jpeg,.png"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Pakta Integritas</label>
                    <div className="checkbox-container">
                      <input type="checkbox" id="integrity-pact" required />
                      <label htmlFor="integrity-pact">
                        Saya menyatakan bahwa data yang saya berikan adalah benar
                      </label>
                    </div>
                  </div>

                  <button type="submit" className="submit-btn glass-effect">
                    Submit Team Registration
                  </button>
                </form>
              )}

              {/* === Individual Registration Form === */}
              {activeTab === 'individual' && (
                <form className="registration-form" onSubmit={handleIndividualSubmit}>
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
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Asal Sekolah</label>
                    <input
                      type="text"
                      className="glass-input"
                      placeholder="Enter your school name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      className="glass-input"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>No. WhatsApp</label>
                    <input
                      type="tel"
                      className="glass-input"
                      placeholder="Enter your WhatsApp number"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Surat Keterangan Sekolah</label>
                    <input
                      type="file"
                      className="glass-input"
                      accept=".pdf,.jpg,.jpeg,.png"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Pakta Integritas</label>
                    <div className="checkbox-container">
                      <input type="checkbox" id="integrity-pact-individual" required />
                      <label htmlFor="integrity-pact-individual">
                        Saya menyatakan bahwa data yang saya berikan adalah benar
                      </label>
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