import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { colonies } from '../../data/data.js';
import './Feed.css';

const Feed = ({ onSaveMatch, currentColony }) => {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId] = useState(localStorage.getItem('currentUserId'));

  const currentProfile = profiles[currentProfileIndex];

  // Fetch compatible users from backend
  useEffect(() => {
    const fetchCompatibleUsers = async () => {
      if (!currentUserId) return;
      
      setLoading(true);
      try {
        // Get compatible users based on user's tags
        const response = await axios.get(`http://localhost:3000/profiles/${currentUserId}/compatibility`);
        
        if (response.data && response.data.length > 0) {
          // Fetch full profile data for compatible users
          const profilePromises = response.data.slice(0, 10).map(async (compatibleUser) => {
            try {
              const profileResponse = await axios.get('http://localhost:3000/profiles', {
                params: { searchUserId: compatibleUser.userId }
              });
              
              if (profileResponse.data && profileResponse.data.length > 0) {
                const profileData = profileResponse.data[0];
                // Convert backend format to frontend format
                return {
                  id: compatibleUser.userId,
                  name: `User ${compatibleUser.userId}`, // Would need to get actual name from users table
                  age: profileData[2] || 25,
                  bio: profileData[3] || 'Looking for meaningful connections!',
                  location: 'City, State', // Would need location from backend
                  colony: currentColony,
                  photos: [profileData[1] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face'],
                  occupation: 'Professional',
                  education: 'University',
                  height: '5\'10"',
                  interests: ['Technology', 'Music', 'Travel'],
                  compatibility: compatibleUser.compatibility
                };
              }
              return null;
            } catch (error) {
              console.error('Error fetching profile for user:', compatibleUser.userId, error);
              return null;
            }
          });

          const fetchedProfiles = await Promise.all(profilePromises);
          const validProfiles = fetchedProfiles.filter(profile => profile !== null);
          setProfiles(validProfiles);
        }
      } catch (error) {
        console.error('Error fetching compatible users:', error);
        // Fallback to empty profiles array
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompatibleUsers();
  }, [currentUserId, currentColony]);

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

  if (loading) {
    return (
      <div className="feed-container">
        <div className="loading">
          <div className="loading-icon">🐝</div>
          <p>Finding your perfect matches...</p>
        </div>
      </div>
    );
  }

  if (!currentProfile || profiles.length === 0) {
    return (
      <div className="feed-container">
        <div className="no-profiles">
          <div className="no-profiles-icon">🐝</div>
          <h2>No compatible profiles found!</h2>
          <p>Complete your profile to get better matches.</p>
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
            {currentProfile.compatibility && (
              <div className="compatibility-score">
                💕 {Math.round(currentProfile.compatibility)}% Match
              </div>
            )}
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
