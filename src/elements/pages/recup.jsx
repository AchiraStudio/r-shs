import { useState, useEffect, useCallback, useMemo } from 'react';
import { getCompetitions } from '../api/competitions';
import axiosInstance from '../api/axiosInstance';
import Swal from 'sweetalert2';
import DynamicIsland from "../../rshs/Components/DynamicI";
import './css/recup.css';
import './css/dynamic-greek.css'

function Recup() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('squad'); // 'squad' or 'individual'
  const [compData, setCompData] = useState([]);
  const [snapToken, setSnapToken] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [paymentPending, setPaymentPending] = useState(false);
  const [pendingRegistration, setPendingRegistration] = useState(null);

  // State to save form data when modal closes
  const [savedFormData, setSavedFormData] = useState({
    teamLeader: {
      name: '',
      phone: '',
      photo: null,
      surat: null,
      pakta: null
    },
    teamMembers: [],
    officials: [],
    selectedCompetition: "",
    teamName: "",
    email: "",
    whatsapp: "",
    school: ""
  });

  const [teamLeader, setTeamLeader] = useState({
    name: '',
    phone: '',
    photo: null,
    surat: null,
    pakta: null
  });

  const [teamMembers, setTeamMembers] = useState([]);
  const [officials, setOfficials] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState("");

  const competitionsWithoutSchool = useMemo(() => [
    "Modern Dance",
    "Band",
    "English Debate"
  ], []);

  const shouldShowSchool = !competitionsWithoutSchool.includes(selectedCompetition);

  const totalFee = useMemo(() => {
    if (!selectedCompetition) return 0;

    const competition = compData.find(c =>
      (c.name || c.title || c) === selectedCompetition
    );

    if (!competition) return 0;

    const baseFee = competition.fee || 0;
    const totalPeople = teamMembers.length + 1;

    if (selectedCompetition === "Short Movie") {
      const FREE_MEMBERS = 5;
      const EXTRA_FEE_PER_PERSON = 20000;

      if (totalPeople <= FREE_MEMBERS) {
        return baseFee;
      } else {
        const extraPeople = totalPeople - FREE_MEMBERS;
        return baseFee + (extraPeople * EXTRA_FEE_PER_PERSON);
      }
    }

    return baseFee;
  }, [selectedCompetition, teamMembers.length, compData]);

  // Function to save current form data
  const saveFormData = useCallback(() => {
    const form = document.querySelector('.registration-form');
    if (!form) return;

    const formData = new FormData(form);
    const teamName = formData.get('name') || '';
    const email = formData.get('email') || '';
    const whatsapp = formData.get('whatsapp') || '';
    const school = formData.get('school') || '';

    setSavedFormData({
      teamLeader: { ...teamLeader },
      teamMembers: [...teamMembers],
      officials: [...officials],
      selectedCompetition,
      teamName,
      email,
      whatsapp,
      school
    });
  }, [teamLeader, teamMembers, officials, selectedCompetition]);

  // Function to restore saved form data
  const restoreFormData = useCallback(() => {
    setTeamLeader(savedFormData.teamLeader);
    setTeamMembers(savedFormData.teamMembers);
    setOfficials(savedFormData.officials);
    setSelectedCompetition(savedFormData.selectedCompetition);

    // Set form values after a short delay to ensure DOM is ready
    setTimeout(() => {
      const form = document.querySelector('.registration-form');
      if (!form) return;

      if (form.name) form.name.value = savedFormData.teamName;
      if (form.email) form.email.value = savedFormData.email;
      if (form.whatsapp) form.whatsapp.value = savedFormData.whatsapp;
      if (form.school) form.school.value = savedFormData.school;
    }, 100);
  }, [savedFormData]);

  // Function to reset form data
  const resetFormData = useCallback(() => {
    setTeamLeader({
      name: '',
      phone: '',
      photo: null,
      surat: null,
      pakta: null
    });
    setTeamMembers([]);
    setOfficials([]);
    setSelectedCompetition("");
    
    // Reset form fields
    setTimeout(() => {
      const form = document.querySelector('.registration-form');
      if (!form) return;

      if (form.name) form.name.value = '';
      if (form.email) form.email.value = '';
      if (form.whatsapp) form.whatsapp.value = '';
      if (form.school) form.school.value = '';
    }, 100);
  }, []);

  const addTeamMember = useCallback(() => {
    const maxMembersMap = {
      "Basket Putra": 12,
      "Basket Putri": 12,
      "Voli Putra": 12,
      "Voli Putri": 12,
      "Futsal Putra SMP": 12,
      "Futsal Putra SMA": 12,
      "E-sport MLBB SMP": 7,
      "E-sport MLBB SMA": 7,
      "Modern Dance": 10,
      "KIR": 3,
      "Band": 7,
      "English Debate": 3,
    };

    const maxMembers = maxMembersMap[selectedCompetition] || 100;

    if (teamMembers.length >= maxMembers - 1) {
      Swal.fire({ icon: 'warning', title: 'Batas Anggota Tercapai', text: `Maksimal ${maxMembers} orang (termasuk ketua) untuk ${selectedCompetition}.`, confirmButtonColor: '#facc15' });
      return;
    }

    setTeamMembers(prev => [...prev, { name: '', phone: '', photo: null, surat: null, pakta: null }]);
  }, [selectedCompetition, teamMembers.length]);

  const updateTeamMember = useCallback((index, field, value) => {
    setTeamMembers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const removeTeamMember = useCallback((index) => {
    setTeamMembers(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateTeamLeader = useCallback((field, value) => {
    setTeamLeader(prev => ({ ...prev, [field]: value }));
  }, []);

  const addOfficial = useCallback((role) => {
    setOfficials(prev => [...prev, { role, name: '', phone: '', photo: null }]);
  }, []);

  const updateOfficial = useCallback((index, field, value) => {
    setOfficials(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const removeOfficial = useCallback((index) => {
    setOfficials(prev => prev.filter((_, i) => i !== index));
  }, []);

  function loadMidtransScript(clientKey) {
    return new Promise((resolve) => {
      if (document.querySelector('script[src*="snap.js"]')) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      script.setAttribute("data-client-key", clientKey);
      script.async = true;
      script.onload = resolve;
      document.body.appendChild(script);
    });
  }

  const handlePayment = useCallback((token) => {
    if (!window.snap) {
      Swal.fire({ icon: 'error', title: 'Sistem Pembayaran Belum Siap', text: 'Silakan refresh halaman dan coba lagi.', confirmButtonColor: '#ef4444' }); return;
    }

    setPaymentPending(true);

    window.snap.pay(token, {
      onSuccess: function (result) {
        console.log('Payment success:', result);
        Swal.fire({
          icon: 'success',
          title: 'Pembayaran Berhasil!',
          text: 'Terima kasih, pembayaran Anda telah dikonfirmasi 🎉',
          confirmButtonColor: '#3b82f6'
        });

        setPaymentPending(false);
        setPendingRegistration(null);
        setSnapToken(null);
        setIsModalOpen(false);

        // Reset form data after successful payment
        resetFormData();
      },
      onPending: function (result) {
        console.log('Payment pending:', result);
        Swal.fire({ icon: 'info', title: 'Menunggu Pembayaran', text: 'Silakan selesaikan pembayaran Anda melalui Midtrans.', confirmButtonColor: '#3b82f6' }); setPaymentPending(false);
      },
      onError: function (result) {
        console.error('Payment error:', result);
        Swal.fire({ icon: 'error', title: 'Pembayaran Gagal', text: 'Silakan coba lagi atau hubungi panitia.', confirmButtonColor: '#ef4444' });
        setPaymentPending(false);
      },
      onClose: function () {
        console.log('Payment popup closed');
        setPaymentPending(false);
      }
    });
  }, []);

  useEffect(() => {
    if (snapToken && !paymentPending && pendingRegistration) {
      handlePayment(snapToken);
    }
  }, [snapToken, paymentPending, pendingRegistration, handlePayment]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const competitions = await getCompetitions();

        if (isMounted) {
          let competitionsList = [];

          if (Array.isArray(competitions)) {
            competitionsList = competitions;
          } else if (competitions?.competitions && Array.isArray(competitions.competitions)) {
            competitionsList = competitions.competitions;
          } else if (competitions?.data && Array.isArray(competitions.data)) {
            competitionsList = competitions.data;
          }

          setCompData(competitionsList);
        }
      } catch (err) {
        console.error("Failed to fetch competitions:", err);
        if (isMounted) {
          setCompData([]);
        }
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, []);

  // Updated to use environment variable for Midtrans client key
  useEffect(() => {
    const clientKey = import.meta.env.VITE_APP_MIDTRANS_CLIENT_KEY;
    
    if (!clientKey) {
      console.error('Midtrans client key not found in environment variables');
      return;
    }
    
    loadMidtransScript(clientKey);
  }, []);

  // Form submission handlers
  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData(e.target);

      const competition = compData.find(c =>
        (c.name || c.title || c) === selectedCompetition
      );

      formData.append('competition_id', competition?.id || 1);
      formData.append('total_fee', totalFee);
      formData.append('total_members', teamMembers.length + 1);

      const allMembers = [
        {
          name: teamLeader.name,
          phone: teamLeader.phone,
          is_leader: true
        },
        ...teamMembers.map(m => ({
          name: m.name,
          phone: m.phone,
          is_leader: false
        }))
      ];
      formData.append('team_members', JSON.stringify(allMembers));

      const officialsData = officials.map(o => ({
        role: o.role,
        name: o.name,
        phone: o.phone
      }));
      formData.append('officials', JSON.stringify(officialsData));

      if (teamLeader.photo) formData.append(`leader_photo`, teamLeader.photo);
      if (teamLeader.surat) formData.append(`leader_surat`, teamLeader.surat);
      if (teamLeader.pakta) formData.append(`leader_pakta`, teamLeader.pakta);

      teamMembers.forEach((member, idx) => {
        if (member.photo) formData.append(`member_${idx}_photo`, member.photo);
        if (member.surat) formData.append(`member_${idx}_surat`, member.surat);
        if (member.pakta) formData.append(`member_${idx}_pakta`, member.pakta);
      });

      officials.forEach((official, idx) => {
        if (official.photo) formData.append(`official_${idx}_photo`, official.photo);
      });

      const response = await axiosInstance.post('/registrationdata', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.snap_token) {
        setSnapToken(response.data.snap_token);
        setPendingRegistration(response.data);
        setSubmitting(false);
        handlePayment(response.data.snap_token);
      } else {
        throw new Error('No snap token received');
      }

    } catch (error) {
      console.error('Registration failed:', error);
      setSubmitting(false);
      setPaymentPending(false);
      Swal.fire({ icon: 'error', title: 'Registrasi Gagal', text: 'Terjadi kesalahan. Silakan coba lagi.', confirmButtonColor: '#ef4444' });
    }
  };

  const handleIndividualSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData(e.target);

      const competition = compData.find(c =>
        (c.name || c.title || c) === selectedCompetition
      );

      formData.append('competition_id', competition?.id || 1);
      formData.append('total_fee', totalFee);
      formData.append('total_members', 1);

      const allMembers = [
        {
          name: teamLeader.name,
          phone: teamLeader.phone,
          is_leader: true
        }
      ];
      formData.append('team_members', JSON.stringify(allMembers));

      if (teamLeader.photo) formData.append(`leader_photo`, teamLeader.photo);
      if (teamLeader.surat) formData.append(`leader_surat`, teamLeader.surat);
      if (teamLeader.pakta) formData.append(`leader_pakta`, teamLeader.pakta);

      const response = await axiosInstance.post('/registrationdata', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.snap_token) {
        setSnapToken(response.data.snap_token);
        setPendingRegistration(response.data);
        setSubmitting(false);
        handlePayment(response.data.snap_token);
      } else {
        throw new Error('No snap token received');
      }

    } catch (error) {
      console.error('Registration failed:', error);
      setSubmitting(false);
      setPaymentPending(false);
      Swal.fire({ icon: 'error', title: 'Registrasi Gagal', text: 'Terjadi kesalahan. Silakan coba lagi.', confirmButtonColor: '#ef4444' });
    }
  };

  // Handle modal close with data saving
  const handleCloseModal = useCallback(() => {
    if (!submitting && !paymentPending) {
      // Save current form data before closing
      saveFormData();
      setIsModalOpen(false);
    }
  }, [submitting, paymentPending, saveFormData]);

  // Handle modal open with data restoration
  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
    // Restore saved form data when opening the modal
    setTimeout(() => {
      restoreFormData();
    }, 100);
  }, [restoreFormData]);

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
            <img src="./assets/recup/overlay.webp" alt="Sunray Overlay" loading="lazy" decoding="async" />
          </div>

          <div className="title-greek-container">
            <div className="main-title-greek">
              <img src="./assets/recup/title.webp" alt="Event Title" fetchPriority="high" decoding="async" />
            </div>
          </div>

          <div className="middle-greek-container">
            <div className="sunray-greek">
              <img src="./assets/recup/sunray.webp" alt="Sunray" className="spin" loading="lazy" decoding="async" />
            </div>
            <div className="building-greek-container">
              <img src="./assets/recup/building.webp" alt="Greek Building" fetchPriority="high" decoding="async" />
            </div>
          </div>

          <div className="clouds-greek-container">
            <div className="cloud-greek-left">
              <img src="./assets/recup/cloud.webp" alt="Cloud Left" loading="lazy" decoding="async" />
            </div>
            <div className="cloud-greek-right">
              <img src="./assets/recup/cloud.webp" alt="Cloud Right" loading="lazy" decoding="async" />
            </div>
          </div>

          <div className="buttons-greek-container">
            <div className="top-button-greek">
              <button onClick={() => window.location.href = "https://linktr.ee/recisascension.register"}>
                Registration
              </button>
              {/* <button>Info Lomba</button> */}
            </div>
            <div className="bottom-button-greek">
              <button onClick={() => window.location.href = "https://drive.google.com/file/d/1Eq1_Lmkfp0Mp_S6Wz0quEHP3I8CceA8B/view?usp=sharing"}>Guidebook</button>
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
                      <h3 className="box-title">Volley Putri</h3>
                      <button className="box-button">Guidebook</button>
                    </div>
                  </div>
                  <div className="small-box ancient-paper">
                    <div className="box-content">
                      <h3 className="box-title">Esport</h3>
                      <div className="button-group">
                        <button className="box-button">SMA</button>
                        <button className="box-button">SMP</button>
                        <button className="box-button">Guidebook</button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="large-box ancient-paper">
                  <div className="box-content">
                    <h3 className="box-title">Basket</h3>
                    <div className="button-group">
                      <button className="box-button">Putra</button>
                      <button className="box-button">Putri</button>
                      <button className="box-button">Guidebook</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Left - 1 large box | Right - 2 small boxes */}
              <div className="grid-row">
                <div className="large-box ancient-paper">
                  <div className="box-content">
                    <h3 className="box-title">Futsal Putra</h3>
                    <div className="button-group">
                      <button className="box-button">SMA</button>
                      <button className="box-button">SMP</button>
                      <button className="box-button">Guidebook</button>
                    </div>
                  </div>
                </div>
                
                <div className="right-column">
                  <div className="small-box ancient-paper">
                    <div className="box-content">
                      <h3 className="box-title">Band</h3>
                      <button className="box-button">Guidebook</button>
                    </div>
                  </div>
                  <div className="small-box ancient-paper">
                    <div className="box-content">
                      <h3 className="box-title">Short Movie</h3>
                      <button className="box-button">Guidebook</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: 2 large boxes */}
              <div className="grid-row">
                <div className="large-box ancient-paper">
                  <div className="box-content">
                    <h3 className="box-title">English Debate</h3>
                    <button className="box-button">Guidebook</button>
                  </div>
                </div>
                <div className="large-box ancient-paper">
                  <div className="box-content">
                    <h3 className="box-title">KIR IPA</h3>
                    <div className="button-group">
                      <button className="box-button">SMA</button>
                      <button className="box-button">SMP</button>
                      <button className="box-button">Guidebook</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 4: Single large box */}
              <div className="grid-row-center">
                <div className="single-large-box ancient-paper">
                  <div className="box-content">
                    <h3 className="center-title">Modern Dance</h3>
                    <button className="box-button">Guidebook</button>
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
        <div
          className="modal-overlay"
          onClick={handleCloseModal}
        >
          <div
            className="registration-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Registration Form</h2>
              <button
                className="close-btn"
                onClick={handleCloseModal}
                aria-label="Close modal"
                disabled={submitting || paymentPending}
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
            </div>

            <div className="modal-content">
              {/* === Team Registration Form === */}
              {activeTab === 'squad' && (
                <form className="registration-form" onSubmit={handleTeamSubmit}>
                  <div className="form-group">
                    <label>Pilih Kompetisi</label>
                    <div className="custom-dropdown">
                      <select
                        name="competition"
                        className="dropdown-select"
                        value={selectedCompetition}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedCompetition(value);
                          setTeamLeader({ name: '', phone: '', photo: null, surat: null, pakta: null });
                          setTeamMembers([]);
                          setOfficials([]);
                        }}
                        required
                        disabled={submitting || paymentPending}
                      >
                        <option value="">-- Pilih Kompetisi --</option>
                        {compData && compData.length > 0 ? (
                          compData.map((comp, idx) => (
                            <option key={idx} value={comp.name || comp.title || comp}>
                              {comp.name || comp.title || comp}
                            </option>
                          ))
                        ) : (
                          <option disabled>Loading competitions...</option>
                        )}
                      </select>
                      <div className="dropdown-arrow">⌄</div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Nama Tim</label>
                    <input
                      type="text"
                      name="name"
                      className="glass-input"
                      placeholder="Masukkan nama tim"
                      required
                      disabled={submitting || paymentPending}
                    />
                  </div>

                  <div className="form-group">
                    <label className="section-label">Data Ketua Tim</label>
                    <div className="team-member-card">
                      <div className="team-member-header">
                        <span className="team-badge">Ketua Tim</span>
                      </div>

                      <input
                        type="text"
                        name="team_leader"
                        className="glass-input margin-bottom"
                        placeholder="Nama lengkap ketua tim"
                        value={teamLeader.name}
                        onChange={(e) => updateTeamLeader('name', e.target.value)}
                        required
                        disabled={submitting || paymentPending}
                      />

                      <input
                        type="tel"
                        className="glass-input margin-bottom"
                        placeholder="Nomor HP ketua tim"
                        value={teamLeader.phone}
                        onChange={(e) => updateTeamLeader('phone', e.target.value)}
                        required
                        disabled={submitting || paymentPending}
                      />

                      <label className="file-label">Pas Foto Ketua Tim</label>
                      <input
                        type="file"
                        className="glass-input margin-bottom"
                        accept="image/*"
                        onChange={(e) => updateTeamLeader('photo', e.target.files[0])}
                        required
                        disabled={submitting || paymentPending}
                      />

                      <label className="file-label">Kartu Pelajar/Surat Keterangan</label>
                      <input
                        type="file"
                        className="glass-input margin-bottom"
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        onChange={(e) => updateTeamLeader('surat', e.target.files[0])}
                        required
                        disabled={submitting || paymentPending}
                      />

                      <label className="file-label">Pakta Integritas</label>
                      <input
                        type="file"
                        className="glass-input"
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        onChange={(e) => updateTeamLeader('pakta', e.target.files[0])}
                        required
                        disabled={submitting || paymentPending}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Anggota Tim (Selain Ketua)</label>
                    {teamMembers.length === 0 && (
                      <p className="empty-state">
                        Belum ada anggota tambahan. Klik tombol "Tambah Anggota" untuk menambahkan.
                      </p>
                    )}
                    {teamMembers.map((member, index) => (
                      <div key={`team-member-${index}`} className="team-member-card margin-bottom">
                        <div className="member-header">
                          <strong className="member-title">Anggota {index + 1}</strong>
                          <button
                            type="button"
                            className="remove-member-btn"
                            onClick={() => removeTeamMember(index)}
                            disabled={submitting || paymentPending}
                          >
                            ×
                          </button>
                        </div>

                        <input
                          type="text"
                          className="glass-input small-margin"
                          placeholder="Nama lengkap"
                          value={member.name}
                          onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                          required
                          disabled={submitting || paymentPending}
                        />

                        <input
                          type="tel"
                          className="glass-input small-margin"
                          placeholder="Nomor HP"
                          value={member.phone}
                          onChange={(e) => updateTeamMember(index, 'phone', e.target.value)}
                          required
                          disabled={submitting || paymentPending}
                        />

                        <label className="file-label">Pas Foto</label>
                        <input
                          type="file"
                          className="glass-input small-margin"
                          accept="image/*"
                          onChange={(e) => updateTeamMember(index, 'photo', e.target.files[0])}
                          required
                          disabled={submitting || paymentPending}
                        />

                        <label className="file-label">Kartu Pelajar/Surat Keterangan</label>
                        <input
                          type="file"
                          className="glass-input small-margin"
                          accept=".pdf,.jpg,.jpeg,.png,.webp"
                          onChange={(e) => updateTeamMember(index, 'surat', e.target.files[0])}
                          required
                          disabled={submitting || paymentPending}
                        />

                        <label className="file-label">Pakta Integritas</label>
                        <input
                          type="file"
                          className="glass-input"
                          accept=".pdf,.jpg,.jpeg,.png,.webp"
                          onChange={(e) => updateTeamMember(index, 'pakta', e.target.files[0])}
                          required
                          disabled={submitting || paymentPending}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      className="add-member-btn"
                      onClick={addTeamMember}
                      disabled={submitting || paymentPending}
                    >
                      + Tambah Anggota
                    </button>
                  </div>

                  <div className="form-group">
                    <label>Pendamping (Opsional)</label>
                    <div className="official-buttons-container">
                      <button
                        type="button"
                        className="official-btn"
                        onClick={() => addOfficial('coach')}
                        disabled={submitting || paymentPending}
                      >
                        + Coach
                      </button>
                      <button
                        type="button"
                        className="official-btn"
                        onClick={() => addOfficial('guru_pendamping')}
                        disabled={submitting || paymentPending}
                      >
                        + Guru Pendamping
                      </button>
                      <button
                        type="button"
                        className="official-btn"
                        onClick={() => addOfficial('official')}
                        disabled={submitting || paymentPending}
                      >
                        + Official
                      </button>
                    </div>

                    {officials.map((official, index) => (
                      <div key={`official-${index}`} className="official-card margin-bottom">
                        <div className="member-header">
                          <strong className="official-title">
                            {official.role.replace('_', ' ')}
                          </strong>
                          <button
                            type="button"
                            className="remove-member-btn small"
                            onClick={() => removeOfficial(index)}
                            disabled={submitting || paymentPending}
                          >
                            ×
                          </button>
                        </div>

                        <input
                          type="text"
                          className="glass-input small-margin"
                          placeholder="Nama lengkap"
                          value={official.name}
                          onChange={(e) => updateOfficial(index, 'name', e.target.value)}
                          required
                          disabled={submitting || paymentPending}
                        />

                        <input
                          type="tel"
                          className="glass-input small-margin" 
                          placeholder="Nomor Whatsapp"
                          value={official.phone}
                          onChange={(e) => updateOfficial(index, 'phone', e.target.value)}
                          required
                          disabled={submitting || paymentPending}
                        />

                        <label className="file-label">Pas Foto</label>
                        <input
                          type="file"
                          className="glass-input"
                          accept="image/*"
                          onChange={(e) => updateOfficial(index, 'photo', e.target.files[0])}
                          required
                          disabled={submitting || paymentPending}
                        />
                      </div>
                    ))}
                  </div>

                  {shouldShowSchool && (
                    <div className="form-group fade-in">
                      <label>Asal Sekolah</label>
                      <input
                        type="text"
                        name="school"
                        className="glass-input"
                        placeholder="Enter your school name"
                        required
                        disabled={submitting || paymentPending}
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      className="glass-input"
                      placeholder="Enter your email"
                      required
                      disabled={submitting || paymentPending}
                    />
                  </div>

                  <div className="form-group">
                    <label>No. WhatsApp</label>
                    <input
                      type="tel"
                      name="whatsapp"
                      className="glass-input"
                      placeholder="Enter your WhatsApp number"
                      required
                      disabled={submitting || paymentPending}
                    />
                  </div>

                  <div className="form-group total-fee-section">
                    <div className="total-fee-header">
                      <span className="total-fee-label">Total Biaya:</span>
                      <span className="total-fee-amount">
                        Rp {totalFee.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {selectedCompetition === "Short Movie" && (
                      <small className="total-fee-details">
                        {teamMembers.length + 1 <= 5 ? (
                          <>
                            {teamMembers.length + 1} orang (termasuk dalam base fee)
                          </>
                        ) : (
                          <>
                            Base fee (5 orang) + {teamMembers.length + 1 - 5} orang × Rp 20.000
                          </>
                        )}
                      </small>
                    )}

                    {selectedCompetition && selectedCompetition !== "Short Movie" && (
                      <small className="total-fee-details">
                        Harga flat per tim ({teamMembers.length + 1} orang)
                      </small>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Konfirmasi Data</label>
                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        id="integrity-pact"
                        required
                        disabled={submitting || paymentPending}
                      />
                      <label htmlFor="integrity-pact">
                        Saya menyatakan bahwa data yang saya berikan adalah benar
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={submitting || paymentPending}
                  >
                    {submitting ? (
                      <div className="button-content">
                        <span className="spinner"></span>
                        Processing...
                      </div>
                    ) : paymentPending ? (
                      <div className="button-content">
                        <span className="spinner"></span>
                        Waiting for Payment...
                      </div>
                    ) : 'Daftar & Bayar'}
                  </button>

                  {snapToken && !submitting && !paymentPending && (
                    <button
                      type="button"
                      onClick={() => handlePayment(snapToken)}
                      className="retry-payment-btn"
                    >
                      🔄 Bayar Sekarang
                    </button>
                  )}
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