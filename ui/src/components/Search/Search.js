import React, { useState } from 'react';
import { dummyUsers, colonies } from '../../data/data.js';
import './Search.css';

const Search = ({ onSaveMatch, currentColony }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingProfile, setViewingProfile] = useState(null);
  
  const colonyUsers = dummyUsers.filter(user => user.colony === currentColony);
  const [filteredUsers, setFilteredUsers] = useState(colonyUsers);

  const handleSearch = () => {
    let filtered = colonyUsers.filter(user => {
      const matchesName = user.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesName;
    });
    
    setFilteredUsers(filtered);
  };

  const handleAddToHive = (user) => {
    if (onSaveMatch) {
      onSaveMatch(user);
    }
    console.log(`Added ${user.name} to your Hive!`);
  };

  const handleBuzzOff = (user) => {
    console.log(`Buzzed off ${user.name}`);
  };

  React.useEffect(() => {
    handleSearch();
  }, [searchTerm, currentColony]);

  React.useEffect(() => {
    const colonyUsers = dummyUsers.filter(user => user.colony === currentColony);
    setFilteredUsers(colonyUsers);
  }, [currentColony]);

  if (viewingProfile) {
    return (
      <div className="search-container">
        <button 
          className="back-btn"
          onClick={() => setViewingProfile(null)}
        >
          ← Back to Search
        </button>
        <div className="profile-view">
          <div className="profile-card">
            <div className="profile-photos">
              <img 
                src={viewingProfile.photos[0]} 
                alt={viewingProfile.name}
                className="profile-main-photo"
              />
              {viewingProfile.photos.length > 1 && (
                <div className="additional-photos">
                  {viewingProfile.photos.slice(1).map((photo, index) => (
                    <img 
                      key={index}
                      src={photo} 
                      alt={`${viewingProfile.name} ${index + 2}`}
                      className="profile-additional-photo"
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div className="profile-info">
              <div className="profile-header">
                <h2 className="profile-name">{viewingProfile.name}, {viewingProfile.age}</h2>
                <p className="profile-location">{viewingProfile.location}</p>
                <div className="profile-colony">
                  <span className="colony-badge" style={{ backgroundColor: colonies[viewingProfile.colony].color }}>
                    🏛️ {colonies[viewingProfile.colony].name}
                  </span>
                </div>
              </div>
              
              <div className="profile-details">
                <p className="profile-bio">{viewingProfile.bio}</p>
                
                <div className="profile-stats">
                  <div className="stat-item">
                    <span className="stat-label">Occupation:</span>
                    <span className="stat-value">{viewingProfile.occupation}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Education:</span>
                    <span className="stat-value">{viewingProfile.education}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Height:</span>
                    <span className="stat-value">{viewingProfile.height}</span>
                  </div>
                </div>
                
                <div className="profile-interests">
                  <h4>Interests</h4>
                  <div className="interests-list">
                    {viewingProfile.interests.map((interest, index) => (
                      <span key={index} className="interest-item">{interest}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="action-buttons">
              <button 
                className="buzz-off-btn"
                onClick={() => handleBuzzOff(viewingProfile)}
              >
                🐝 Buzz Off
              </button>
              <button 
                className="honey-btn"
                onClick={() => handleAddToHive(viewingProfile)}
              >
                🍯 You're Bee-utiful (+3 🍯)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-container">
      <div className="search-header">
        <h2 className="search-title">🔍 Find Your Match</h2>
        <div className="colony-indicator">
          <span className="colony-badge" style={{ backgroundColor: colonies[currentColony].color }}>
            Exploring: {colonies[currentColony].name}
          </span>
        </div>
      </div>

      <div className="search-filters">
        <div className="filter-group">
          <label>Search by Name</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter name..."
            className="search-input"
          />
        </div>
      </div>

      <div className="search-results">
        <h3>Found {filteredUsers.length} matches in {colonies[currentColony].name}</h3>
        <div className="results-grid">
          {filteredUsers.map(user => (
            <div key={user.id} className="result-card" onClick={() => setViewingProfile(user)}>
              <img src={user.photos[0]} alt={user.name} className="result-photo" />
              <div className="result-info">
                <h4>{user.name}, {user.age}</h4>
                <p>{user.location}</p>
                <p className="result-bio">{user.bio.substring(0, 100)}...</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default Search;
