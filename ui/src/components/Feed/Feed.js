import React, { useState } from 'react';
import { dummyUsers, colonies } from '../../data/data.js';
import './Feed.css';

const Feed = ({ onSaveMatch, currentColony }) => {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [profiles] = useState(dummyUsers.filter(user => user.colony === currentColony));

  const currentProfile = profiles[currentProfileIndex];

  const handleBuzzOff = () => {
    if (currentProfileIndex < profiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1);
    } else {
      setCurrentProfileIndex(0);
    }
  };

  const handleYoureMyHoney = () => {
    console.log(`Matched with ${currentProfile.name}!`);
    if (onSaveMatch) {
      onSaveMatch(currentProfile);
    }
    if (currentProfileIndex < profiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1);
    } else {
      setCurrentProfileIndex(0);
    }
  };

  if (!currentProfile) {
    return (
      <div className="feed-container">
        <div className="no-profiles">
          <div className="no-profiles-icon">🐝</div>
          <h2>No profiles in {colonies[currentColony].name}!</h2>
          <p>Try exploring other colonies on the map to find more matches.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <div className="profile-card">
        <div className="profile-photos">
          <img 
            src={currentProfile.photos[0]} 
            alt={currentProfile.name}
            className="profile-main-photo"
          />
          {currentProfile.photos.length > 1 && (
            <div className="additional-photos">
              {currentProfile.photos.slice(1).map((photo, index) => (
                <img 
                  key={index}
                  src={photo} 
                  alt={`${currentProfile.name} ${index + 2}`}
                  className="profile-additional-photo"
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="profile-info">
          <div className="profile-header">
            <h2 className="profile-name">{currentProfile.name}, {currentProfile.age}</h2>
            <p className="profile-location">{currentProfile.location}</p>
            <div className="profile-colony">
              <span className="colony-badge" style={{ backgroundColor: colonies[currentProfile.colony].color }}>
                🏛️ {colonies[currentProfile.colony].name}
              </span>
            </div>
          </div>
          
          <div className="profile-details">
            <p className="profile-bio">{currentProfile.bio}</p>
            
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-label">Occupation:</span>
                <span className="stat-value">{currentProfile.occupation}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Education:</span>
                <span className="stat-value">{currentProfile.education}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Height:</span>
                <span className="stat-value">{currentProfile.height}</span>
              </div>
            </div>
            
            <div className="profile-interests">
              <h4>Interests</h4>
              <div className="interests-list">
                {currentProfile.interests.map((interest, index) => (
                  <span key={index} className="interest-item">{interest}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="action-buttons">
          <button 
            className="buzz-off-btn"
            onClick={handleBuzzOff}
          >
            🐝 Buzz Off
          </button>
          <button 
            className="honey-btn"
            onClick={handleYoureMyHoney}
          >
            🍯 You're Bee-utiful (+3 🍯)
          </button>
        </div>
      </div>
    </div>
  );
};


export default Feed;
