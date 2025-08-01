import '../css/crew.css'
import crewData from '../../json/crew.json';
import React, { useState, useEffect } from 'react';

const CrewSection = () => {
  const [activeTab, setActiveTab] = useState(crewData.tabs.find(tab => tab.active)?.id || crewData.tabs[0].id);
  const [activeItems, setActiveItems] = useState({});
  const [imageSources, setImageSources] = useState({});

  // Initialize active tab and image sources
  useEffect(() => {
    // Set first tab as active if none is marked active
    if (!crewData.tabs.some(tab => tab.active)) {
      setActiveTab(crewData.tabs[0].id);
    }

    // Initialize image sources
    const initialSources = {};
    crewData.groups.forEach(group => {
      group.members.forEach((member, index) => {
        const key = `${group.id}-${index}`;
        initialSources[key] = member.image;
      });
    });
    setImageSources(initialSources);
  }, []);

  // Handle tab click
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  // Handle crew item click
  const handleItemClick = (groupId, itemIndex) => {
    const key = `${groupId}-${itemIndex}`;
    
    // Toggle active state
    setActiveItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));

    // Toggle image source if alt image exists
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

  // Generate random glow colors for each item
  const glowColors = [
    'rgba(255, 105, 180, 0.4)',  // Pink
    'rgba(100, 210, 255, 0.4)',  // Blue
    'rgba(120, 255, 120, 0.4)',  // Green
    'rgba(255, 215, 0, 0.4)',    // Gold
    'rgba(200, 120, 255, 0.4)',  // Purple
    'rgba(255, 165, 0, 0.4)',    // Orange
    'rgba(70, 240, 240, 0.4)'    // Teal
  ];

  const getRandomGlowColor = () => {
    return glowColors[Math.floor(Math.random() * glowColors.length)];
  };

  // Generate random pulse animation parameters
  const getPulseAnimation = () => {
    const pulseIntensity = 0.2 + Math.random() * 0.3;
    const pulseSpeed = 3 + Math.random() * 4;
    return {
      '--glow-color': getRandomGlowColor(),
      animation: `pulse ${pulseSpeed}s infinite`,
      boxShadow: `0 10px 30px rgba(0,0,0,0.1), 0 0 15px var(--glow-color)`
    };
  };

  return (
    <section className="crew" id="crew">
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 10px 30px rgba(0,0,0,0.1), 0 0 15px var(--glow-color); }
          50% { box-shadow: 0 10px 30px rgba(0,0,0,0.1), 0 0 25px var(--glow-color); }
          100% { box-shadow: 0 10px 30px rgba(0,0,0,0.1), 0 0 15px var(--glow-color); }
        }
      `}</style>
      
      <div className="crew-content">
        <h2>{crewData.title}</h2>
        <p>{crewData.description}</p>
        
        {/* Division Tabs */}
        <div className="crew-tabs">
          {crewData.tabs.map((tab) => (
            <div 
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
              data-tab={tab.id}
            >
              {tab.name}
            </div>
          ))}
        </div>
        
        {/* Crew Members */}
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
                const pulseStyle = getPulseAnimation();

                return (
                  <div 
                    key={index}
                    className={`crew-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleItemClick(group.id, index)}
                    style={pulseStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.2), 0 0 30px var(--glow-color)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = pulseStyle.boxShadow;
                    }}
                  >
                    <div className="pfp">
                      <img
                        src={currentImage}
                        data-alt={member.altImage || member.image}
                        alt={index}
                        style={{ opacity: 1 }}
                      />
                    </div>
                    <div className={`text-crew ${member.subtitle ? 'anggota' : ''}`}>
                      <h3>{member.title}</h3>
                      {member.subtitle && <p>{member.subtitle}</p>}
                    </div>
                    <div className={`crew-popup ${isActive ? 'show' : ''}`}>
                      <ul>
                        {member.membersList.map((name, i) => (
                          <li key={i}>{name}</li>
                        ))}
                      </ul>
                    </div>
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