import { useState, useEffect, useRef } from "react";
import DynamicIsland from "../../rshs/Components/DynamicI";
import "./css/recup.css";
import "./css/recup-column.css";
import "./css/dynamic-greek.css";

import RecupGuestStar from "../../rshs/Components/recup/recup-tulus";
import RecupSpecialPerformance from "../../rshs/Components/recup/recup-jiband";
import RecupCompetitions from "../../rshs/Components/recup/recup-list-lomba";
import RecupFooter from "../../rshs/Components/recup/recup-footer";
import RecupMerch from "../../rshs/Components/recup/recup-merch";

const SCHEDULE_API =
  "https://script.google.com/macros/s/AKfycbxcR39xEqBTH8Rq8lAE2hLvZXKzwWOdG8LK0qqWm7m7kjyYlrm2QAHx2L2XxE-TRJQ3/exec";

function Recup() {
  const [compData, setCompData] = useState([]);
  const [matchSchedules, setMatchSchedules] = useState([]);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const scheduleRef = useRef(null);
  const scheduleRefMobile = useRef(null);
  const scrollIntervalRef = useRef(null);
  const scrollIntervalRefMobile = useRef(null);

  /* ===========================
     FETCH SCHEDULE FROM SHEETS
     =========================== */
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch(SCHEDULE_API, { cache: "no-store" });
        const data = await res.json();

        if (Array.isArray(data)) {
          setMatchSchedules(data);
        } else {
          console.warn("Schedule data is not an array", data);
        }
      } catch (err) {
        console.error("Failed to fetch schedule", err);
      }
    };

    fetchSchedule();
    const interval = setInterval(fetchSchedule, 20000);
    return () => clearInterval(interval);
  }, []);

  /* ===========================
     WORKING ENDLESS SCROLL - DESKTOP
     =========================== */
  useEffect(() => {
    if (!scheduleRef.current || matchSchedules.length === 0) return;

    const scrollContainer = scheduleRef.current;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const getSingleCycleHeight = () => {
      const items = scrollContainer.querySelectorAll(".schedule-item");
      if (!items.length) return 0;

      let height = 0;
      const originalCount = Math.ceil(items.length / 2);

      for (let i = 0; i < originalCount; i++) {
        height += items[i].offsetHeight;
        const style = window.getComputedStyle(items[i]);
        height += parseInt(style.marginBottom) || 0;
      }

      return height;
    };

    const startScrolling = () => {
      scrollIntervalRef.current = setInterval(() => {
        const cycleHeight = getSingleCycleHeight();
        
        if (cycleHeight > 0) {
          scrollPosition += scrollSpeed;
          
          if (scrollPosition >= cycleHeight) {
            scrollPosition = scrollPosition - cycleHeight;
            scrollContainer.scrollTop = scrollPosition;
          } else {
            scrollContainer.scrollTop = scrollPosition;
          }
        }
      }, 20);
    };

    const timeoutId = setTimeout(startScrolling, 100);

    return () => {
      clearTimeout(timeoutId);
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [matchSchedules]);

  /* ===========================
     WORKING ENDLESS SCROLL - MOBILE
     =========================== */
  useEffect(() => {
    if (!scheduleRefMobile.current || matchSchedules.length === 0 || !isScheduleOpen) return;

    const scrollContainer = scheduleRefMobile.current;
    let scrollPosition = 0;
    const scrollSpeed = 0.3;

    const getSingleCycleHeight = () => {
      const items = scrollContainer.querySelectorAll(".mobile-schedule-item");
      if (!items.length) return 0;

      let height = 0;
      const originalCount = Math.ceil(items.length / 2);

      for (let i = 0; i < originalCount; i++) {
        height += items[i].offsetHeight;
        const style = window.getComputedStyle(items[i]);
        height += parseInt(style.marginBottom) || 0;
      }

      return height;
    };

    const startScrolling = () => {
      scrollIntervalRefMobile.current = setInterval(() => {
        const cycleHeight = getSingleCycleHeight();
        
        if (cycleHeight > 0) {
          scrollPosition += scrollSpeed;
          
          if (scrollPosition >= cycleHeight) {
            scrollPosition = scrollPosition - cycleHeight;
            scrollContainer.scrollTop = scrollPosition;
          } else {
            scrollContainer.scrollTop = scrollPosition;
          }
        }
      }, 20);
    };

    const timeoutId = setTimeout(startScrolling, 100);

    return () => {
      clearTimeout(timeoutId);
      if (scrollIntervalRefMobile.current) {
        clearInterval(scrollIntervalRefMobile.current);
      }
    };
  }, [matchSchedules, isScheduleOpen]);

  /* ===========================
     DUPLICATED DATA
     =========================== */
  const duplicatedSchedules = [...matchSchedules, ...matchSchedules];

  return (
    <>
      <DynamicIsland className="greek" />

      {/* ================ DESKTOP VERSION ================ */}
      {/* MATCH SCHEDULE OVERLAY - Desktop Sidebar */}
      <div className="match-schedule-overlay desktop">
        <div className="schedule-container" ref={scheduleRef}>
          {duplicatedSchedules.map((match, index) => (
            <div key={`${match.id}-${index}`} className="schedule-item">
              <div className="match-teams">
                <span className="team-name">{match.team1}</span>
                <span className="vs-text">VS</span>
                <span className="team-name">{match.team2}</span>
              </div>

              <div className="match-details">
                <div className="match-info">
                  <span className="match-date">{match.date}</span>
                  <span className="match-time">{match.time}</span>
                </div>

                <div className="match-category">{match.category}</div>

                <div className={`match-status ${match.status}`}>
                  {match.status === "live" ? (
                    <>
                      <span className="status-dot" />
                      <span>LIVE</span>
                    </>
                  ) : (
                    "TBD"
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================ MOBILE VERSION ================ */}
      {/* Modern Mobile Toggle Button */}
      <button 
        className="schedule-toggle-btn mobile-only"
        onClick={() => setIsScheduleOpen(true)}
        aria-label="Open match schedule"
      >
        <svg className="schedule-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
          <path d="M8 14h.01"></path>
          <path d="M12 14h.01"></path>
          <path d="M16 14h.01"></path>
          <path d="M8 18h.01"></path>
          <path d="M12 18h.01"></path>
          <path d="M16 18h.01"></path>
        </svg>
        {matchSchedules.length > 0 && (
          <span className="badge">{matchSchedules.length}</span>
        )}
      </button>

      {/* Modern Mobile Overlay */}
      <div className={`mobile-schedule-overlay ${isScheduleOpen ? 'active' : ''}`}>
        {/* Modern Header */}
        <div className="mobile-schedule-header">
          <div className="header-content">
            <h2 className="mobile-schedule-title">
              Match Schedule
            </h2>
            <div className="schedule-stats">
              <span className="stat-item">
                <span className="stat-icon">⏱️</span>
                Updates every 20s
              </span>
              <span className="stat-item">
                <span className="stat-icon">📊</span>
                {matchSchedules.length} matches
              </span>
            </div>
          </div>
          
          {/* Modern Close Button */}
          <button 
            className="mobile-schedule-close-btn"
            onClick={() => setIsScheduleOpen(false)}
            aria-label="Close schedule"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {/* Modern Schedule Container */}
        <div className="mobile-schedule-container" ref={scheduleRefMobile}>
          {duplicatedSchedules.map((match, index) => (
            <div key={`${match.id}-${index}`} className="mobile-schedule-item">
              {/* Match Header */}
              <div className="mobile-match-header">
                <div className="mobile-match-badge">{match.category}</div>
                <div className={`mobile-match-status ${match.status}`}>
                  {match.status === "live" ? (
                    <>
                      <span className="status-dot" />
                      <span>LIVE NOW</span>
                    </>
                  ) : (
                    <span className="upcoming-badge">UPCOMING</span>
                  )}
                </div>
              </div>
              
              {/* Teams Section */}
              <div className="mobile-match-teams">
                <div className="mobile-team">
                  <div className="mobile-team-name">{match.team1}</div>
                  <div className="mobile-team-vs">HOME</div>
                </div>
                
                <div className="mobile-match-vs">
                  <span className="mobile-vs-text">VS</span>
                  <div className="mobile-match-time-badge">
                    <span className="time-icon">🕒</span>
                    <span>{match.time}</span>
                  </div>
                </div>
                
                <div className="mobile-team">
                  <div className="mobile-team-name">{match.team2}</div>
                  <div className="mobile-team-vs">AWAY</div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="mobile-match-footer">
                <div className="mobile-match-date">
                  <span className="date-icon">📅</span>
                  <span>{match.date}</span>
                </div>
                {match.venue && (
                  <div className="mobile-match-venue">
                    <span className="venue-icon">📍</span>
                    <span>{match.venue}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Modern Footer */}
        <div className="mobile-schedule-footer">
          <div className="live-indicator">
            <span className="live-dot"></span>
            <span>Live matches update automatically</span>
          </div>
          <button className="refresh-btn" onClick={() => window.location.reload()}>
            <span className="refresh-icon">🔄</span>
            Refresh
          </button>
        </div>
      </div>

      {/* ================ MAIN LANDING PAGE ================ */}
      <div className="recup-container">
        <div className="liquid-bg">
          <div className="liquid-shape shape-1" />
          <div className="liquid-shape shape-2" />
          <div className="liquid-shape shape-3" />
          <div className="liquid-shape shape-4" />
        </div>

        <section className="landing-ael">
          <div className="sunray-overlay">
            <img src="./assets/recup/overlay.webp" alt="Overlay" />
          </div>

          <div className="title-greek-container">
            <div className="main-title-greek">
              <img src="./assets/recup/title.webp" alt="Title" />
            </div>
          </div>

          <div className="middle-greek-container">
            <div className="sunray-greek">
              <img src="./assets/recup/sunray.webp" alt="Sunray" className="spin" />
            </div>
            <div className="building-greek-container">
              <img src="./assets/recup/building.webp" alt="Building" />
            </div>
          </div>

          <div className="clouds-greek-container">
            <div className="cloud-greek-left">
              <img src="./assets/recup/cloud.webp" alt="Cloud" />
            </div>
            <div className="cloud-greek-right">
              <img src="./assets/recup/cloud.webp" alt="Cloud" />
            </div>
          </div>

          <div className="buttons-greek-container">
            <div className="top-button-greek">
              <button
                onClick={() =>
                  (window.location.href =
                    "https://docs.google.com/forms/d/e/1FAIpQLSdlOBaqKPofTeWQV_mXpp1mxzLJFpX17ZyjLZzl8jV59ADqcg/viewform")
                }
              >
                Registration
              </button>
            </div>

            <div className="bottom-button-greek">
              <button
              >
                <a href="#guest-star">Guest Star</a>
              </button>
            </div>
          </div>
        </section>
      </div>

      <RecupGuestStar></RecupGuestStar>
      <RecupSpecialPerformance></RecupSpecialPerformance>
      <RecupCompetitions></RecupCompetitions>
      <RecupMerch></RecupMerch>
      <RecupFooter></RecupFooter>
    </>
  );
}

export default Recup;