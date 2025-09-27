import React, { useState } from 'react';
import './Hive.css';

const Hive = ({ savedMatches, onRemoveMatch, onViewProfile, onOpenMessage }) => {
  const [hoveredMatch, setHoveredMatch] = useState(null);

  const handleCardClick = (match) => {
    if (onViewProfile) {
      onViewProfile(match);
    }
  };

  const handleMessageClick = (e, match) => {
    e.stopPropagation();
    if (onOpenMessage) {
      onOpenMessage(match);
    } else {
      console.log(`Message ${match.name} - Feature coming soon!`);
    }
  };

  return (
    <div className="hive-container">
      <div className="hive-content">
        <h2 className="hive-title">🍯 Your Hive</h2>
        <p className="hive-subtitle">Your saved matches are buzzing here!</p>
        
        {savedMatches.length === 0 ? (
          <div className="empty-hive">
            <div className="empty-hive-icon">🐝</div>
            <p>Your hive is empty! Start swiping to find your matches.</p>
          </div>
        ) : (
          <div className="matches-grid">
            {savedMatches.map((match) => (
              <div 
                key={match.id}
                className="match-card"
                onMouseEnter={() => setHoveredMatch(match.id)}
                onMouseLeave={() => setHoveredMatch(null)}
                onClick={() => handleCardClick(match)}
              >
                <div 
                  className="match-photo"
                  style={{
                    backgroundImage: `url(${match.photos[0]})`,
                    cursor: 'pointer'
                  }}
                >
                  {hoveredMatch === match.id && (
                    <div className="match-overlay">
                      <button 
                        className="message-btn"
                        onClick={(e) => handleMessageClick(e, match)}
                      >
                        💬
                      </button>
                      <button 
                        className="remove-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveMatch(match.id);
                        }}
                      >
                        ❌
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="match-info">
                  <h3 className="match-name">{match.name}</h3>
                  <p className="match-age">{match.age} years old</p>
                  <p className="match-location">{match.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hive;
