import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Feed.css';
import { tagColonies, getUserColonies } from '../../services/api.js';


const Feed = ({ onSaveMatch, currentColony, onNavigateToMessage }) => {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [currentUserId] = useState(sessionStorage.getItem('currentUserId'));
  const [userColonies, setUserColonies] = useState({});

  const currentProfile = profiles[currentProfileIndex];

  const getColonyInfo = (colonyId) => {
    return userColonies[colonyId] || tagColonies[colonyId] || { 
      name: 'Unknown Colony', 
      color: '#ffc107' 
    };
  };

  useEffect(() => {
    console.log('Feed: Component mounted');
    console.log('Feed: Session storage contents:');
    console.log('- currentUserId:', sessionStorage.getItem('currentUserId'));
    console.log('- userName:', sessionStorage.getItem('userName'));
    console.log('- currentUserEmail:', sessionStorage.getItem('currentUserEmail'));
  }, []);

  // Load user's colonies first
  useEffect(() => {
    const loadUserColonies = async () => {
      if (!currentUserId) return;
      
      try {
        console.log('Feed: Loading user colonies...');
        const colonyData = await getUserColonies(currentUserId);
        if (colonyData) {
          setUserColonies(colonyData.colonies);
          console.log('Feed: User colonies loaded:', Object.keys(colonyData.colonies));
        } else {
          setUserColonies(tagColonies);
          console.log('Feed: Using fallback tag colonies');
        }
      } catch (error) {
        console.error('Feed: Error loading user colonies:', error);
        setUserColonies(tagColonies);
      }
    };
    
    loadUserColonies();
  }, [currentUserId]);

  useEffect(() => {
    const fetchCompatibleUsers = async () => {
      console.log('Feed: Starting fetchCompatibleUsers for colony:', currentColony);
      console.log('Feed: currentUserId:', currentUserId);

      if (!currentUserId || !currentColony) {
        console.log('Feed: Missing currentUserId or currentColony');
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

            const profilePromises = compatibilityResponse.data.slice(0, 50).map(async (compatibleUser) => {
              try {
                console.log('Feed: Fetching profile for compatible user:', compatibleUser.userId);
                const profileResponse = await axios.get('http://localhost:3000/profiles', {
                  params: { searchUserId: compatibleUser.userId }
                });

                if (profileResponse.data && profileResponse.data.length > 0) {
                  const profileData = profileResponse.data[0];
                  
                  // Get colony assignment based on database tags
                  const { getUserColonyFromTags } = await import('../../services/api');
                  const userColony = await getUserColonyFromTags(compatibleUser.userId);
                  
                  // Only include users from the current colony
                  if (userColony === currentColony) {
                    return {
                      id: compatibleUser.userId,
                      name: profileData[4] || `User ${compatibleUser.userId}`,
                      age: profileData[2] || 25,
                      bio: profileData[3] || 'Looking for meaningful connections!',
                      location: profileData[6] || 'City, State',
                      colony: userColony,
                      photos: [profileData[1] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face'],
                      occupation: 'Professional',
                      education: 'University',
                      height: '5\'10"',
                      compatibility: Math.min(100, Math.max(0, Math.round(compatibleUser.compatibility))) || 75
                    };
                  }
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
            console.log('Feed: Compatible profiles in current colony:', fetchedProfiles.length);
          }
        } catch (compatibilityError) {
          console.log('Feed: Compatibility endpoint failed:', compatibilityError.response?.status, compatibilityError.message);
        }

        if (fetchedProfiles.length === 0) {
          console.log('Feed: Fetching all profiles as fallback for colony:', currentColony);
          try {
            const allProfilesResponse = await axios.get('http://localhost:3000/profiles');
            console.log('Feed: All profiles response:', allProfilesResponse.data?.length || 0, 'profiles found');

            if (allProfilesResponse.data && allProfilesResponse.data.length > 0) {
              const profilePromises = allProfilesResponse.data
                .filter(profile => profile[0] !== currentUserId) // exclude current user
                .slice(0, 50)
                .map(async (profileData) => {
                  try {
                    // Get colony assignment based on database tags
                    const { getUserColonyFromTags } = await import('../../services/api');
                    const userColony = await getUserColonyFromTags(profileData[0]);
                    
                    // Only include users from the current colony
                    if (userColony === currentColony) {
                      return {
                        id: profileData[0],
                        name: profileData[4] || profileData[0],
                        age: profileData[2] || 25,
                        bio: profileData[3] || 'Looking for meaningful connections!',
                        location: profileData[6] || 'City, State',
                        colony: userColony,
                        photos: [profileData[1] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face'],
                        occupation: 'Professional',
                        education: 'University',
                        height: '5\'10"',
                        compatibility: Math.min(100, Math.max(60, Math.floor(Math.random() * 40) + 60))
                      };
                    }
                    return null;
                  } catch (error) {
                    console.error('Error processing profile:', profileData[0], error);
                    return null;
                  }
                });

              const allProfiles = await Promise.all(profilePromises);
              fetchedProfiles = allProfiles.filter(profile => profile !== null);
              fetchedProfiles.sort((a, b) => (b.compatibility || 0) - (a.compatibility || 0));
              console.log('Feed: Fallback profiles in current colony:', fetchedProfiles.length);
            }
          } catch (allProfilesError) {
            console.error('Feed: Failed to fetch all profiles:', allProfilesError);
          }
        }

        console.log('Feed: Final fetched profiles for colony', currentColony + ':', fetchedProfiles.length);
        setProfiles(fetchedProfiles);
        setCurrentProfileIndex(0); // Reset to first profile when colony changes
      } catch (error) {
        console.error('Error fetching compatible users:', error);
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have user colonies loaded
    if (Object.keys(userColonies).length > 0) {
      fetchCompatibleUsers();
    }
  }, [currentUserId, currentColony, userColonies]);

  const handleBuzzOff = async () => {
    if (!currentProfile || transitioning) return;
    
    console.log(`Buzzing off ${currentProfile.name}`);
    setTransitioning(true);
    
    // Add a small delay for visual feedback
    setTimeout(() => {
      if (currentProfileIndex >= profiles.length - 1) {
        // If we're at the last profile, cycle back to beginning
        console.log('Feed: Reached end of profiles, cycling back to start');
        setCurrentProfileIndex(0);
      } else {
        // Move to next profile
        const nextIndex = currentProfileIndex + 1;
        console.log(`Feed: Moving to profile index ${nextIndex}`);
        setCurrentProfileIndex(nextIndex);
      }
      setTransitioning(false);
    }, 300);
  };

  const handleYoureMyHoney = async () => {
    if (!currentProfile || transitioning) return;
    
    console.log(`Matched with ${currentProfile.name}!`);
    setTransitioning(true);
    
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
    
    // Move to next profile after a delay
    setTimeout(() => {
      if (currentProfileIndex >= profiles.length - 1) {
        setCurrentProfileIndex(0);
      } else {
        setCurrentProfileIndex(currentProfileIndex + 1);
      }
      setTransitioning(false);
    }, 300);
  };

  if (loading) {
    return (
      <div className="feed-container">
        <div className="loading">
          <div className="loading-icon">🐝</div>
          <p>Finding matches in {getColonyInfo(currentColony).name}...</p>
        </div>
      </div>
    );
  }

  if (!currentProfile || profiles.length === 0) {
    return (
      <div className="feed-container">
        <div className="no-profiles">
          <div className="no-profiles-icon">🐝</div>
          <h2>No matches in {getColonyInfo(currentColony).name}!</h2>
          <p>Try exploring other colonies to find more matches.</p>
          <div className="colony-info">
            <span className="colony-badge" style={{ backgroundColor: getColonyInfo(currentColony).color }}>
              {getColonyInfo(currentColony).icon} {getColonyInfo(currentColony).name}
            </span>
          </div>
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
      <div className={`profile-card ${transitioning ? 'transitioning' : ''}`}>
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
              <span className="colony-badge" style={{ backgroundColor: getColonyInfo(currentProfile.colony).color }}>
                🏛️ {getColonyInfo(currentProfile.colony).name}
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
          <button 
            className={`buzz-off-btn ${transitioning ? 'disabled' : ''}`} 
            onClick={handleBuzzOff}
            disabled={transitioning}
          >
            {transitioning ? '🔄' : '🐝'} Buzz Off
          </button>
          <button 
            className={`honey-btn ${transitioning ? 'disabled' : ''}`} 
            onClick={handleYoureMyHoney}
            disabled={transitioning}
          >
            {transitioning ? '🔄' : '🍯'} You're Bee-utiful (+3 🍯)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feed;
