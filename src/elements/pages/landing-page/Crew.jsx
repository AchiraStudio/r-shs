import '../css/crew.css'
import crewData from '../../json/crew.json';
import React, { useState, useEffect, useRef } from 'react';

const CrewSection = () => {
  const [activeTab, setActiveTab] = useState(crewData.tabs.find(tab => tab.active)?.id || crewData.tabs[0].id);
  const [activeItems, setActiveItems] = useState({});
  const [imageSources, setImageSources] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef(null);

  // Initialize active tab and image sources
  useEffect(() => {
    if (!crewData.tabs.some(tab => tab.active)) {
      setActiveTab(crewData.tabs[0].id);
    }

    const initialSources = {};
    crewData.groups.forEach(group => {
      group.members.forEach((member, index) => {
        const key = `${group.id}-${index}`;
        initialSources[key] = member.image;
      });
    });
    setImageSources(initialSources);
  }, []);

  // Handle tab click with smooth transition
  const handleTabClick = async (tabId) => {
    if (tabId === activeTab || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Add exit animation to current active group
    const currentGroup = document.querySelector('.crew-group.active');
    if (currentGroup) {
      currentGroup.style.animation = 'slideOutLeft 0.4s ease forwards';
    }
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    setActiveTab(tabId);
    
    // Add enter animation to new active group
    setTimeout(() => {
      const newGroup = document.querySelector('.crew-group.active');
      if (newGroup) {
        newGroup.style.animation = 'slideInRight 0.4s ease forwards';
      }
    }, 50);
    
    setTimeout(() => setIsTransitioning(false), 400);
  };

  // Handle crew item click with enhanced animation
  const handleItemClick = (groupId, itemIndex) => {
    const key = `${groupId}-${itemIndex}`;
    
    // Add click animation
    const itemElement = document.querySelector(`[data-key="${key}"]`);
    if (itemElement) {
      itemElement.style.transform = 'scale(0.95)';
      setTimeout(() => {
        itemElement.style.transform = '';
      }, 150);
    }
    
    // Toggle active state
    setActiveItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));

    // Toggle image with crossfade effect
    const group = crewData.groups.find(g => g.id === groupId);
    if (group && group.members[itemIndex].altImage) {
      setImageSources(prev => ({
        ...prev,
        [key]: prev[key] === group.members[itemIndex].image 
          ? group.members[itemIndex].altImage 
          : group.members[itemIndex].image
      }));
    }
  };

  // Enhanced glow colors with better distribution
  const glowColors = [
    'rgba(255, 105, 180, 0.6)',  // Hot Pink
    'rgba(100, 210, 255, 0.6)',  // Light Blue
    'rgba(120, 255, 120, 0.6)',  // Lime Green
    'rgba(255, 215, 0, 0.6)',    // Gold
    'rgba(200, 120, 255, 0.6)',  // Purple
    'rgba(255, 165, 0, 0.6)',    // Orange
    'rgba(70, 240, 240, 0.6)',   // Teal
    'rgba(255, 100, 100, 0.6)'   // Coral
  ];

  const getRandomGlowColor = (index) => {
    return glowColors[index % glowColors.length];
  };

  // Enhanced animation parameters
  const getItemAnimation = (index) => {
    const pulseSpeed = 3 + (index % 3);
    const glowColor = getRandomGlowColor(index);
    
    return {
      '--glow-color': glowColor,
      animationDelay: `${(index * 0.1)}s`,
      '--pulse-intensity': '0.4',
      '--hover-intensity': '0.8'
    };
  };

  return (
    <section className="crew" id="crew" ref={containerRef}>
      <style>{`
        @keyframes pulse {
          0% { 
            box-shadow: 0 10px 30px rgba(0,0,0,0.1), 0 0 20px var(--glow-color);
            transform: translateY(0px);
          }
          50% { 
            box-shadow: 0 15px 40px rgba(0,0,0,0.15), 0 0 30px var(--glow-color);
            transform: translateY(-5px);
          }
          100% { 
            box-shadow: 0 10px 30px rgba(0,0,0,0.1), 0 0 20px var(--glow-color);
            transform: translateY(0px);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideOutLeft {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-50px);
          }
        }
        
        @keyframes tabBounce {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        @keyframes imageTilt {
          0% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.05) rotate(1deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
      `}</style>
      
      <div className="crew-content">
        <h2 className="crew-title">{crewData.title}</h2>
        <p className="crew-description">{crewData.description}</p>
        
        {/* Enhanced Division Tabs */}
        <div className="crew-tabs">
          {crewData.tabs.map((tab, index) => (
            <div 
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''} ${isTransitioning ? 'disabled' : ''}`}
              onClick={() => handleTabClick(tab.id)}
              data-tab={tab.id}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="tab-content">{tab.name}</span>
              <div className="tab-indicator"></div>
            </div>
          ))}
        </div>
        
        {/* Enhanced Crew Members */}
        <div className="crew-list">
          {crewData.groups.map((group) => (
            <div 
              key={group.id} 
              className={`crew-group ${activeTab === group.id ? 'active' : ''}`} 
              id={group.id}
            >
              {group.members.map((member, index) => {
                const itemKey = `${group.id}-${index}`;
                const isActive = activeItems[itemKey];
                const currentImage = imageSources[itemKey] || member.image;
                const animationStyle = getItemAnimation(index);

                return (
                  <div 
                    key={index}
                    data-key={itemKey}
                    className={`crew-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleItemClick(group.id, index)}
                    style={animationStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.zIndex = '10';
                      e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.zIndex = '';
                      e.currentTarget.style.transform = 'translateY(0px) scale(1)';
                    }}
                  >
                    <div className="pfp">
                      <img
                        src={currentImage}
                        data-alt={member.altImage || member.image}
                        alt={member.title}
                        className="crew-image"
                      />
                      <div className="image-overlay"></div>
                    </div>
                    <div className={`text-crew ${member.subtitle ? 'anggota' : ''}`}>
                      <h3>{member.title}</h3>
                      {member.subtitle && <p>{member.subtitle}</p>}
                    </div>
                    <div className={`crew-popup ${isActive ? 'show' : ''}`}>
                      <div className="popup-content">
                        <h4>Team Members</h4>
                        <ul>
                          {member.membersList.map((name, i) => (
                            <li key={i}>{name}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="click-indicator">Click for details</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CrewSection;