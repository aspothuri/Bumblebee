import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Feed.css';

const Feed = ({ onSaveMatch, currentColony, onNavigateToMessage }) => {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId] = useState(sessionStorage.getItem('currentUserId'));

  const currentProfile = profiles[currentProfileIndex];

  useEffect(() => {
    console.log('Feed: Component mounted');
    console.log('Feed: Session storage contents:');
    console.log('- currentUserId:', sessionStorage.getItem('currentUserId'));
    console.log('- userName:', sessionStorage.getItem('userName'));
    console.log('- currentUserEmail:', sessionStorage.getItem('currentUserEmail'));
  }, []);

  const colonies = {
    honeycomb: { name: "Honeycomb Heights", color: "#ffc107", unlocked: true, cost: 0 },
    meadow: { name: "Meadow Fields", color: "#4caf50", unlocked: false, cost: 15 },
    sunset: { name: "Sunset Valley", color: "#ff9800", unlocked: false, cost: 20 },
    crystal: { name: "Crystal Gardens", color: "#2196f3", unlocked: false, cost: 25 },
    forest: { name: "Whispering Woods", color: "#795548", unlocked: false, cost: 30 },
    ocean: { name: "Ocean Breeze", color: "#00bcd4", unlocked: false, cost: 35 }
  };

  useEffect(() => {
    const fetchCompatibleUsers = async () => {
      console.log('Feed: Starting fetchCompatibleUsers...');
      console.log('Feed: currentUserId:', currentUserId);

      if (!currentUserId) {
        console.log('Feed: No currentUserId found - user may not be logged in');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        let fetchedProfiles = [];

        try {
          console.log('Feed: Attempting compatibility API call...');
          const compatibilityResponse = await axios.get(
            `http://localhost:3000/profiles/${currentUserId}/compatibility`
          );
          console.log('Feed: Compatibility response:', compatibilityResponse.data);

          if (compatibilityResponse.data && compatibilityResponse.data.length > 0) {
            console.log('Feed: Found compatible users:', compatibilityResponse.data.length);

            const profilePromises = compatibilityResponse.data.slice(0, 10).map(async (compatibleUser) => {
              try {
                console.log('Feed: Fetching profile for compatible user:', compatibleUser.userId);
                const profileResponse = await axios.get('http://localhost:3000/profiles', {
                  params: { searchUserId: compatibleUser.userId }
                });

                if (profileResponse.data && profileResponse.data.length > 0) {
                  const profileData = profileResponse.data[0];
                  return {
                    id: compatibleUser.userId,
                    name: profileData[4] || `User ${compatibleUser.userId}`,
                    age: profileData[2] || 25,
                    bio: profileData[3] || 'Looking for meaningful connections!',
                    location: profileData[6] || 'City, State',
                    colony: currentColony,
                    photos: [profileData[1] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face'],
                    occupation: 'Professional',
                    education: 'University',
                    height: '5\'10"',
                    compatibility: Math.min(100, Math.max(0, Math.round(compatibleUser.compatibility))) || 75
                  };
                }
                return null;
              } catch (error) {
                console.error('Error fetching profile for user:', compatibleUser.userId, error);
                return null;
              }
            });

            const compatibleProfiles = await Promise.all(profilePromises);
            fetchedProfiles = compatibleProfiles.filter(profile => profile !== null);
            fetchedProfiles.sort((a, b) => (b.compatibility || 0) - (a.compatibility || 0));
          }
        } catch (compatibilityError) {
          console.log('Feed: Compatibility endpoint failed:', compatibilityError.response?.status, compatibilityError.message);
        }

        if (fetchedProfiles.length === 0) {
          console.log('Feed: Fetching all profiles as fallback...');
          try {
            const allProfilesResponse = await axios.get('http://localhost:3000/profiles');
            console.log('Feed: All profiles response:', allProfilesResponse.data?.length || 0, 'profiles found');

            if (allProfilesResponse.data && allProfilesResponse.data.length > 0) {
              const profilePromises = allProfilesResponse.data
                .filter(profile => profile[0] !== currentUserId) // only exclude current user
                .slice(0, 10)
                .map(async (profileData) => {
                  return {
                    id: profileData[0],
                    name: profileData[4] || profileData[0],
                    age: profileData[2] || 25,
                    bio: profileData[3] || 'Looking for meaningful connections!',
                    location: profileData[6] || 'City, State',
                    colony: currentColony,
                    photos: [profileData[1] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face'],
                    occupation: 'Professional',
                    education: 'University',
                    height: '5\'10"',
                    compatibility: Math.min(100, Math.max(60, Math.floor(Math.random() * 40) + 60))
                  };
                });

              const allProfiles = await Promise.all(profilePromises);
              fetchedProfiles = allProfiles.filter(profile => profile !== null);
              fetchedProfiles.sort((a, b) => (b.compatibility || 0) - (a.compatibility || 0));
            }
          } catch (allProfilesError) {
            console.error('Feed: Failed to fetch all profiles:', allProfilesError);
          }
        }

        console.log('Feed: Final fetched profiles:', fetchedProfiles.length);
        setProfiles(fetchedProfiles);
      } catch (error) {
        console.error('Error fetching compatible users:', error);
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompatibleUsers();
  }, [currentUserId, currentColony]);

  const handleBuzzOff = () => {
    if (!currentProfile) return;
    console.log(`Buzzing off ${currentProfile.name}`);
    const nextIndex = (currentProfileIndex + 1) % profiles.length;
    setCurrentProfileIndex(nextIndex);
  };

  const handleYoureMyHoney = async () => {
    if (!currentProfile) return;
    console.log(`Matched with ${currentProfile.name}!`);
    
    // Save the match first and wait for it to complete
    if (onSaveMatch) {
      try {
        await onSaveMatch(currentProfile);
        console.log('Feed: Match saved successfully, honey should be increased by 3');
        
        // Navigate to conversation with this person after successful save
        if (onNavigateToMessage) {
          onNavigateToMessage(currentProfile);
        }
      } catch (error) {
        console.error('Feed: Error saving match:', error);
        // Still navigate even if save fails
        if (onNavigateToMessage) {
          onNavigateToMessage(currentProfile);
        }
      }
    }
    
    // Move to next profile
    const nextIndex = (currentProfileIndex + 1) % profiles.length;
    setCurrentProfileIndex(nextIndex);
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
          <h2>No profiles found!</h2>
          <p>Check back later for more matches.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              padding: '10px 20px', 
              marginTop: '10px',
              backgroundColor: '#4caf50',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🔄 Refresh
          </button>
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
            <div className="profile-basic-info">
              <h2 className="profile-name">{currentProfile.name}, {currentProfile.age}</h2>
              <p className="profile-location">{currentProfile.location}</p>
            </div>
            {currentProfile.compatibility && (
              <div className="compatibility-score">
                💕 {Math.min(100, Math.round(currentProfile.compatibility))}% Match
              </div>
            )}
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
          </div>
        </div>
        
        <div className="action-buttons">
          <button className="buzz-off-btn" onClick={handleBuzzOff}>
            🐝 Buzz Off
          </button>
          <button className="honey-btn" onClick={handleYoureMyHoney}>
            🍯 You're Bee-utiful (+3 🍯)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feed;
