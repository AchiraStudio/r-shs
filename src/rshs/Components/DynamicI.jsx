import { useState, useEffect, useRef } from 'react';
import { FaCheckCircle, FaInstagram } from "react-icons/fa";
import { GrDomain } from "react-icons/gr";
import { MdOutlineSkipPrevious } from "react-icons/md";
import './DynamicIsland.css'

const DynamicIsland = ({ 
  onMainAction, 
  onActiveAction, 
  onPreviousAction,
  onInstagramClick 
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const islandRef = useRef(null);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleIsland = (e) => {
    e.stopPropagation();
    if (isActive) {
      // Start exit animatio
      setIsExiting(true);
      setTimeout(() => {
        setIsActive(false);
        setIsExiting(false);
      }, 300);
    } else {
      setIsActive(true);
    }
  };

  // Collapse when clicking outside with exit animation
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (islandRef.current && !islandRef.current.contains(e.target) && isActive) {
        setIsExiting(true);
        setTimeout(() => {
          setIsActive(false);
          setIsExiting(false);
        }, 300);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isActive]);

  const handleAction = (action) => {
    // Call the appropriate callback based on action
    switch(action) {
      case 'main':
        onMainAction?.();
        break;
      case 'active':
        onActiveAction?.();
        break;
      case 'previous':
        onPreviousAction?.();
        break;
      default:
        break;
    }
    
    // Start exit animation when action is clicked
    setIsExiting(true);
    setTimeout(() => {
      setIsActive(false);
      setIsExiting(false);
    }, 300);
  };

  const handleSocialClick = (platform) => {
    if (platform === 'instagram') {
      onInstagramClick?.() || window.open('https://instagram.com/rshs', '_blank');
    }
    // Start exit animation
    setIsExiting(true);
    setTimeout(() => {
      setIsActive(false);
      setIsExiting(false);
    }, 300);
  };

  return (
    <div 
      className={`dynamic-island ${isScrolled ? 'scrolled' : ''}`} 
      ref={islandRef}
    >
      <div
        className={`di-compact ${isActive ? 'active' : ''} ${isExiting ? 'exiting' : ''}`}
        onClick={toggleIsland}
      >
        {/* Idle state - green dot and @rshs */}
        <div className="di-idle">
          <span className="di-dot"></span>
          <span className="di-label">@rshs</span>
        </div>

        {/* Expanded grid - only shows when active */}
        {isActive && (
          <div className={`di-grid ${isExiting ? 'exiting' : ''}`}>
            <div className="di-grid-button" onClick={() => handleSocialClick('instagram')}>
              <FaInstagram />
            </div>
            <div className="di-grid-button" onClick={() => handleAction('main')}>
              <GrDomain />
            </div>
            <div className="di-grid-button" onClick={() => handleAction('active')}>
              <FaCheckCircle />
            </div>
            <div className="di-grid-button" onClick={() => handleAction('previous')}>
              <MdOutlineSkipPrevious />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicIsland;