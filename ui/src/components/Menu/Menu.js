import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Feed from '../Feed/Feed';
import Search from '../Search/Search';
import Profile from '../Profile/Profile';
import Hive from '../Hive/Hive';
import Messages from '../Messages/Messages';
import Map from '../Map/Map';
import './Menu.css';

const Menu = () => {
  const [activeView, setActiveView] = useState('default');
  const [savedMatches, setSavedMatches] = useState([]);
  const [viewingProfile, setViewingProfile] = useState(null);
  const [previousView, setPreviousView] = useState(null);
  const [selectedMatchForMessage, setSelectedMatchForMessage] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [honey, setHoney] = useState(10);
  const [currentColony, setCurrentColony] = useState('honeycomb');
  const [userProfilePicture, setUserProfilePicture] = useState(null);
  const [currentUserId] = useState(sessionStorage.getItem('currentUserId'));
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Add debugging and redirect if no user
  useEffect(() => {
    console.log('Menu: Component mounted');
    console.log('Menu: Session storage contents:');
    console.log('- currentUserId:', sessionStorage.getItem('currentUserId'));
    console.log('- userName:', sessionStorage.getItem('userName'));
    console.log('- currentUserEmail:', sessionStorage.getItem('currentUserEmail'));
    
    if (!currentUserId) {
      console.log('Menu: No currentUserId found, redirecting to login');
      navigate('/login');
      return;
    }
    
    console.log('Menu: User is logged in with ID:', currentUserId);
  }, [currentUserId, navigate]);

  // Colony definitions inline
  const colonies = {
    honeycomb: { name: "Honeycomb Heights", color: "#ffc107", unlocked: true, cost: 0 },
    meadow: { name: "Meadow Fields", color: "#4caf50", unlocked: false, cost: 15 },
    sunset: { name: "Sunset Valley", color: "#ff9800", unlocked: false, cost: 20 },
    crystal: { name: "Crystal Gardens", color: "#2196f3", unlocked: false, cost: 25 },
    forest: { name: "Whispering Woods", color: "#795548", unlocked: false, cost: 30 },
    ocean: { name: "Ocean Breeze", color: "#00bcd4", unlocked: false, cost: 35 }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch user data on component mount
  useEffect(() => {
    if (currentUserId) {
      console.log('Menu: Fetching data for user:', currentUserId);
      fetchUserData();
      fetchUserProfile();
      fetchSavedMatches();
    } else {
      console.log('Menu: Skipping data fetch - no currentUserId');
    }
  }, [currentUserId]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/users/${currentUserId}`);
      if (response.data) {
        setHoney(response.data.honey || 10);
        setCurrentColony(response.data.currentColony || 'honeycomb');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Use session storage as fallback
      setHoney(parseInt(sessionStorage.getItem('userHoney')) || 10);
      setCurrentColony(sessionStorage.getItem('userColony') || 'honeycomb');
    }
  };

  const updateUserData = async (updates) => {
    try {
      await axios.put(`http://localhost:3000/users/${currentUserId}`, updates);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:3000/profiles', {
        params: { searchUserId: currentUserId }
      });

      if (response.data && response.data.length > 0) {
        const profileData = response.data[0];
        // Update profile picture from backend
        if (profileData[1]) { // profileImage
          setUserProfilePicture(profileData[1]);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchSavedMatches = async () => {
    try {
      // Fetch matches from backend only
      const response = await axios.get(`http://localhost:3000/matches/${currentUserId}`);
      if (response.data && response.data.length > 0) {
        // For each match, fetch user profile data
        const matchPromises = response.data.map(async (match) => {
          const otherUserId = match.user1Id === currentUserId ? match.user2Id : match.user1Id;
          try {
            const profileResponse = await axios.get('http://localhost:3000/profiles', {
              params: { searchUserId: otherUserId }
            });
            
            if (profileResponse.data && profileResponse.data.length > 0) {
              const profileData = profileResponse.data[0];
              return {
                id: otherUserId,
                name: profileData[4] || `User ${otherUserId}`,
                age: profileData[2] || 25,
                bio: profileData[3] || 'Looking for meaningful connections!',
                location: profileData[6] || 'City, State',
                colony: currentColony,
                photos: [profileData[1] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face'],
                occupation: 'Professional',
                education: 'University',
                height: '5\'10"',
                compatibility: Math.min(100, Math.max(60, Math.floor(Math.random() * 40) + 60)) // Capped at 100%
              };
            }
          } catch (error) {
            console.error('Error fetching match profile:', error);
          }
          return null;
        });

        const resolvedMatches = await Promise.all(matchPromises);
        const validMatches = resolvedMatches.filter(match => match !== null);
        setSavedMatches(validMatches);
      }
    } catch (error) {
      console.error('Error fetching saved matches:', error);
    }
  };

  const handleSaveMatch = async (user) => {
    // Check if already matched
    if (savedMatches.find(match => match.id === user.id)) {
      console.log('Already matched with this user');
      return Promise.resolve(); // Return resolved promise
    }

    try {
      console.log('Saving match:', user.id, 'Current honey:', honey);
      
      // Calculate new honey amount first
      const newHoney = honey + 3;
      console.log('New honey amount will be:', newHoney);
      
      // Update honey immediately in the UI
      setHoney(newHoney);
      
      // Log the match to the server
      await axios.post('http://localhost:3000/matches', {
        user1Id: currentUserId,
        user2Id: user.id,
        matchedAt: new Date().toISOString()
      });

      // Create a chat between users
      await axios.post('http://localhost:3000/chat', {
        user1Id: currentUserId,
        user2Id: user.id
      });

      // Update local state
      const updatedMatches = [...savedMatches, user];
      setSavedMatches(updatedMatches);
      
      // Sync honey with backend
      await updateUserData({ honey: newHoney });
      
      // Also update session storage for persistence
      sessionStorage.setItem('userHoney', newHoney.toString());
      
      console.log('Match saved successfully, honey increased from', honey, 'to', newHoney);
      return Promise.resolve(); // Explicitly return resolved promise
      
    } catch (error) {
      console.error('Error saving match:', error);
      
      // Calculate new honey amount for fallback
      const newHoney = honey + 3;
      
      // Fallback - still add to local state and increase honey even if backend fails
      const updatedMatches = [...savedMatches, user];
      setSavedMatches(updatedMatches);
      setHoney(newHoney);
      
      // Try to update backend anyway
      try {
        await updateUserData({ honey: newHoney });
        sessionStorage.setItem('userHoney', newHoney.toString());
      } catch (updateError) {
        console.error('Failed to update honey in backend:', updateError);
      }
      
      console.log('Match saved with fallback, honey increased to:', newHoney);
      return Promise.resolve(); // Return resolved promise even on error
    }
  };

  const handleNavigateToMessage = (user) => {
    console.log('Menu: Navigating to message with:', user.name);
    setPreviousView(activeView);
    setSelectedMatchForMessage(user);
    setActiveView('messages');
  };

  const handleSendMessage = () => {
    const newHoney = honey + 1;
    setHoney(newHoney);
    updateUserData({ honey: newHoney });
  };

  const handleRemoveMatch = (userId) => {
    setSavedMatches(prev => {
      const updated = prev.filter(match => match.id !== userId);
      return updated;
    });
  };

  const handleViewProfile = (user) => {
    setPreviousView(activeView);
    setViewingProfile(user);
  };

  const handleBackFromProfile = () => {
    setViewingProfile(null);
    if (previousView) {
      setActiveView(previousView);
      setPreviousView(null);
    }
  };

  const handleOpenMessage = (match) => {
    setPreviousView(activeView);
    setSelectedMatchForMessage(match);
    setActiveView('messages');
  };

  const handleBackFromMessages = () => {
    setSelectedMatchForMessage(null);
    if (previousView) {
      setActiveView(previousView);
      setPreviousView(null);
    } else {
      setActiveView('hive');
    }
  };

  const handleProfileIconClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleProfilePictureUpdate = (newPicture) => {
    setUserProfilePicture(newPicture);
  };

  const handleNavigateToProfile = () => {
    setActiveView('profile');
    setShowProfileDropdown(false);
  };

  const handleColonyClick = () => {
    setActiveView('map');
  };

  const handleLogout = () => {
    // Clear session data only
    sessionStorage.removeItem('currentUserId');
    sessionStorage.removeItem('currentUserEmail');
    sessionStorage.removeItem('userName');
    
    navigate('/');
  };

  const renderContent = () => {
    if (viewingProfile) {
      return (
        <div className="profile-view-container">
          <button 
            className="back-btn"
            onClick={handleBackFromProfile}
          >
            ← Back
          </button>
          <div className="viewed-profile">
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
            </div>
          </div>
        </div>
      );
    }

    switch (activeView) {
      case 'feed':
        return <Feed 
          onSaveMatch={handleSaveMatch} 
          currentColony={currentColony} 
          savedMatches={savedMatches} 
          onNavigateToMessage={handleNavigateToMessage}
        />;
      case 'search':
        return <Search onSaveMatch={handleSaveMatch} currentColony={currentColony} />;
      case 'profile':
        return (
          <Profile 
            currentColony={currentColony} 
            userProfilePicture={userProfilePicture}
            onProfilePictureUpdate={handleProfilePictureUpdate}
          />
        );
      case 'hive':
        return (
          <Hive 
            savedMatches={savedMatches}
            onRemoveMatch={handleRemoveMatch}
            onViewProfile={handleViewProfile}
            onOpenMessage={handleOpenMessage}
          />
        );
      case 'messages':
        return (
          <Messages 
            savedMatches={savedMatches}
            onViewProfile={handleViewProfile}
            onBack={handleBackFromMessages}
            selectedMatch={selectedMatchForMessage}
            onSendMessage={handleSendMessage}
          />
        );
      case 'map':
        return (
          <Map 
            currentColony={currentColony}
            honey={honey}
            onColonyChange={setCurrentColony}
            onHoneyChange={setHoney}
          />
        );
      default:
        return (
          <div className="welcome-screen">
            <div className="bee-container">
              <div className="bee-image">🐝</div>
              <h2 className="welcome-text">Get Buzzing!</h2>
              <p className="welcome-subtitle">Ready to find your honey?</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="menu-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">🐝 Bumblebee</h1>
          <div className="header-info">
            <div className="colony-info" onClick={handleColonyClick} style={{ cursor: 'pointer' }}>
              <span className="colony-badge" style={{ backgroundColor: colonies[currentColony].color }}>
                🏛️ {colonies[currentColony].name}
              </span>
            </div>
            <div className="honey-display">
              <span className="honey-icon">🍯</span>
              <span className="honey-amount">{honey}</span>
            </div>
            <div className="profile-icon" ref={dropdownRef}>
              <div className="profile-avatar" onClick={handleProfileIconClick}>
                {userProfilePicture ? (
                  <img 
                    src={userProfilePicture} 
                    alt="Profile" 
                    className="profile-avatar-image"
                  />
                ) : (
                  '👤'
                )}
              </div>
              {showProfileDropdown && (
                <div className="profile-dropdown">
                  <button 
                    className="dropdown-item"
                    onClick={handleNavigateToProfile}
                  >
                    👤 My Profile
                  </button>
                  <button 
                    className="dropdown-item logout-item"
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Menu Navigation */}
      <nav className="menu-nav">
        <button 
          className={`menu-item ${activeView === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveView('feed')}
        >
          <span className="menu-icon">🍯</span>
          <span className="menu-text">Feed</span>
        </button>
        
        <button 
          className={`menu-item ${activeView === 'search' ? 'active' : ''}`}
          onClick={() => setActiveView('search')}
        >
          <span className="menu-icon">🔍</span>
          <span className="menu-text">Search</span>
        </button>

        <button 
          className={`menu-item ${activeView === 'map' ? 'active' : ''}`}
          onClick={() => setActiveView('map')}
        >
          <span className="menu-icon">🗺️</span>
          <span className="menu-text">Map</span>
        </button>

        <button 
          className={`menu-item ${activeView === 'hive' ? 'active' : ''}`}
          onClick={() => setActiveView('hive')}
        >
          <span className="menu-icon">🏠</span>
          <span className="menu-text">Hive</span>
          {savedMatches.length > 0 && (
            <span className="match-count">{savedMatches.length}</span>
          )}
        </button>

        <button 
          className={`menu-item ${activeView === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveView('messages')}
        >
          <span className="menu-icon">💬</span>
          <span className="menu-text">Messages</span>
          {savedMatches.length > 0 && (
            <span className="match-count">{savedMatches.length}</span>
          )}
        </button>
        
        <button 
          className={`menu-item ${activeView === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveView('profile')}
        >
          <span className="menu-icon">👤</span>
          <span className="menu-text">Profile</span>
        </button>
      </nav>

      {/* Content Area */}
      <main className="menu-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default Menu;
