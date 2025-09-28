import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Search.css';

const Search = ({ onSaveMatch, currentColony }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingProfile, setViewingProfile] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId] = useState(sessionStorage.getItem('currentUserId'));

  // Add debugging at component level
  useEffect(() => {
    console.log('Search: Component mounted');
    console.log('Search: Session storage contents:');
    console.log('- currentUserId:', sessionStorage.getItem('currentUserId'));
    console.log('- userName:', sessionStorage.getItem('userName'));
    console.log('- currentUserEmail:', sessionStorage.getItem('currentUserEmail'));
  }, []);

  // Colony definitions inline
  const colonies = {
    honeycomb: { name: "Honeycomb Heights", color: "#ffc107", unlocked: true, cost: 0 },
    meadow: { name: "Meadow Fields", color: "#4caf50", unlocked: false, cost: 15 },
    sunset: { name: "Sunset Valley", color: "#ff9800", unlocked: false, cost: 20 },
    crystal: { name: "Crystal Gardens", color: "#2196f3", unlocked: false, cost: 25 },
    forest: { name: "Whispering Woods", color: "#795548", unlocked: false, cost: 30 },
    ocean: { name: "Ocean Breeze", color: "#00bcd4", unlocked: false, cost: 35 }
  };

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      console.log('Search: Starting fetchUsers...');
      console.log('Search: currentUserId state:', currentUserId);
      
      if (!currentUserId) {
        console.log('Search: No currentUserId found - user may not be logged in');
        setLoading(false);
        setAllUsers([]);
        setFilteredUsers([]);
        return;
      }
      
      console.log('Search: Starting fetch for currentUserId:', currentUserId);
      setLoading(true);
      
      try {
        let fetchedUsers = [];
        
        // First try to get compatible users
        try {
          console.log('Search: Attempting compatibility API call...');
          const compatibilityResponse = await axios.get(`http://localhost:3000/profiles/${currentUserId}/compatibility`);
          console.log('Search: Compatibility response:', compatibilityResponse.data);
          
          if (compatibilityResponse.data && Array.isArray(compatibilityResponse.data) && compatibilityResponse.data.length > 0) {
            console.log('Search: Found compatible users:', compatibilityResponse.data.length);
            
            // Fetch full profile data for each compatible user
            const userPromises = compatibilityResponse.data.slice(0, 50).map(async (compatibleUser) => {
              try {
                console.log('Search: Fetching profile for compatible user:', compatibleUser.userId);
                const profileResponse = await axios.get('http://localhost:3000/profiles', {
                  params: { searchUserId: compatibleUser.userId }
                });
                
                if (profileResponse.data && Array.isArray(profileResponse.data) && profileResponse.data.length > 0) {
                  const profileData = profileResponse.data[0];
                  const colonyKeys = Object.keys(colonies);
                  const randomColony = colonyKeys[Math.floor(Math.random() * colonyKeys.length)];
                  
                  return {
                    id: compatibleUser.userId,
                    name: profileData[4] || `User ${compatibleUser.userId}`,
                    age: profileData[2] || 25,
                    bio: profileData[3] || 'Looking for meaningful connections!',
                    location: profileData[6] || 'City, State',
                    colony: randomColony,
                    photos: [profileData[1] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face'],
                    occupation: 'Professional',
                    education: 'University',
                    height: '5\'10"',
                    compatibility: Math.min(100, Math.max(0, Math.round(compatibleUser.compatibility))) || 75
                  };
                }
                return null;
              } catch (error) {
                console.error('Error fetching profile for compatible user:', compatibleUser.userId, error);
                return null;
              }
            });

            const compatibleProfiles = await Promise.all(userPromises);
            fetchedUsers = compatibleProfiles.filter(user => user !== null);
            console.log('Search: Compatible profiles after filtering:', fetchedUsers.length);
            
            // Ensure users are sorted by compatibility in descending order
            fetchedUsers.sort((a, b) => (b.compatibility || 0) - (a.compatibility || 0));
          } else {
            console.log('Search: No compatible users found in response');
          }
        } catch (compatibilityError) {
          console.log('Search: Compatibility endpoint failed:', compatibilityError.response?.status, compatibilityError.message);
        }
        
        // If no compatible users found or compatibility failed, fetch all profiles
        if (fetchedUsers.length === 0) {
          console.log('Search: Fetching all profiles as fallback...');
          
          try {
            const allProfilesResponse = await axios.get('http://localhost:3000/profiles');
            console.log('Search: All profiles response:', allProfilesResponse.data?.length || 0, 'profiles found');
            
            if (allProfilesResponse.data && Array.isArray(allProfilesResponse.data) && allProfilesResponse.data.length > 0) {
              console.log('Search: Processing', allProfilesResponse.data.length, 'profiles');
              
              // Filter out current user and format profiles
              const filteredProfiles = allProfilesResponse.data.filter(profile => {
                const profileUserId = profile[0];
                const isCurrentUser = profileUserId === currentUserId;
                console.log('Search: Profile', profileUserId, 'is current user?', isCurrentUser);
                return !isCurrentUser && profileUserId && profileUserId !== 'UNKNOWN_USER';
              });
              
              console.log('Search: After filtering current user:', filteredProfiles.length, 'profiles remain');
              
              const profilePromises = filteredProfiles
                .slice(0, 50) // Limit to first 50 profiles
                .map(async (profileData) => {
                  try {
                    const colonyKeys = Object.keys(colonies);
                    const randomColony = colonyKeys[Math.floor(Math.random() * colonyKeys.length)];
                    
                    const formattedProfile = {
                      id: profileData[0],
                      name: profileData[4] || 'Anonymous User',
                      age: profileData[2] || 25,
                      bio: profileData[3] || 'Looking for meaningful connections!',
                      location: profileData[6] || 'City, State',
                      colony: randomColony,
                      photos: [profileData[1] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face'],
                      occupation: 'Professional',
                      education: 'University',
                      height: '5\'10"',
                      compatibility: Math.min(100, Math.max(60, Math.floor(Math.random() * 40) + 60)) // Random compatibility 60-100%, capped at 100%
                    };
                    
                    console.log('Search: Formatted profile:', formattedProfile.name, formattedProfile.id);
                    return formattedProfile;
                  } catch (error) {
                    console.error('Error formatting profile:', error);
                    return null;
                  }
                });

              const allProfiles = await Promise.all(profilePromises);
              fetchedUsers = allProfiles.filter(user => user !== null);
              
              // Sort fallback profiles by compatibility in descending order  
              fetchedUsers.sort((a, b) => (b.compatibility || 0) - (a.compatibility || 0));
              console.log('Search: Final processed profiles:', fetchedUsers.length);
            } else {
              console.log('Search: No profiles found in database response');
            }
          } catch (allProfilesError) {
            console.error('Search: Failed to fetch all profiles:', allProfilesError.response?.status, allProfilesError.message);
          }
        }
        
        console.log('Search: Final fetched users count:', fetchedUsers.length);
        console.log('Search: Sample users with compatibility:', fetchedUsers.slice(0, 3).map(u => ({name: u.name, id: u.id, compatibility: u.compatibility})));
        
        setAllUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers);
        
      } catch (error) {
        console.error('Error in fetchUsers:', error);
        setAllUsers([]);
        setFilteredUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUserId]);

  const handleSearch = () => {
    let filtered = allUsers.filter(user => {
      const matchesName = user.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesName;
    });
    
    setFilteredUsers(filtered);
  };

  const handleAddToHive = async (user) => {
    if (onSaveMatch) {
      try {
        await onSaveMatch(user);
        console.log(`Added ${user.name} to your Hive! +3 honey`);
      } catch (error) {
        console.error('Error adding to hive:', error);
        console.log(`Added ${user.name} to your Hive! (with error)`);
      }
    }
  };

  const handleBuzzOff = (user) => {
    console.log(`Buzzed off ${user.name}`);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm, allUsers]);

  if (loading) {
    return (
      <div className="search-container">
        <div className="loading">
          <div className="loading-icon">🐝</div>
          <p>Searching for users in the hive...</p>
        </div>
      </div>
    );
  }

  if (filteredUsers.length === 0 && !loading) {
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
          <div className="no-results">
            <div className="no-results-icon">🐝</div>
            <h3>No matches found!</h3>
            {searchTerm ? (
              <p>No users match your search for "{searchTerm}". Try a different search term.</p>
            ) : (
              <>
                <p>No other users found in the database.</p>
                <p>Current User ID: {currentUserId}</p>
                <p>Try creating more user accounts through the signup page.</p>
              </>
            )}
            <button 
              onClick={() => {
                setSearchTerm('');
                window.location.reload();
              }}
              style={{ 
                padding: '10px 20px', 
                marginTop: '10px',
                backgroundColor: '#ffc107',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              🔄 Refresh Search
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                <div className="profile-basic-info">
                  <h2 className="profile-name">{viewingProfile.name}, {viewingProfile.age}</h2>
                  <p className="profile-location">{viewingProfile.location}</p>
                </div>
                {viewingProfile.compatibility && (
                  <div className="compatibility-badge">
                    💕 {Math.min(100, Math.round(viewingProfile.compatibility))}%
                  </div>
                )}
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
        <h3>Found {filteredUsers.length} matches across all colonies</h3>
        <div className="results-grid">
          {filteredUsers.map(user => (
            <div key={user.id} className="result-card" onClick={() => setViewingProfile(user)}>
              <img src={user.photos[0]} alt={user.name} className="result-photo" />
              <div className="result-info">
                <div className="result-header">
                  <h4>{user.name}, {user.age}</h4>
                  {user.compatibility && (
                    <span className="result-compatibility">💕 {Math.min(100, Math.round(user.compatibility))}%</span>
                  )}
                </div>
                <p>{user.location}</p>
                <div className="colony-badge" style={{ backgroundColor: colonies[user.colony].color }}>
                  🏛️ {colonies[user.colony].name}
                </div>
                <p className="result-bio">{user.bio.substring(0, 80)}...</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default Search;
