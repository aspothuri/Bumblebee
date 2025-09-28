import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Feed from '../Feed/Feed';
import Search from '../Search/Search';
import Profile from '../Profile/Profile';
import Hive from '../Hive/Hive';
import Messages from '../Messages/Messages';
import Map from '../Map/Map';
import { colonies } from '../../data/data.js';
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
  const [userProfilePicture, setUserProfilePicture] = useState(
    localStorage.getItem('userProfilePicture') || null
  );
  const [currentUserId] = useState(localStorage.getItem('currentUserId'));
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

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
      fetchUserProfile();
      fetchSavedMatches();
    }
  }, [currentUserId]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:3000/profiles', {
        params: { searchUserId: currentUserId }
      });

      if (response.data && response.data.length > 0) {
        const profileData = response.data[0];
        // Update local storage with fetched data
        if (profileData[1]) { // profileImage
          setUserProfilePicture(profileData[1]);
          localStorage.setItem('userProfilePicture', profileData[1]);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchSavedMatches = async () => {
    try {
      // This would need to be implemented with a matches/favorites system in the backend
      // For now, we'll keep using local storage as a fallback
      const savedMatchesFromStorage = localStorage.getItem('savedMatches');
      if (savedMatchesFromStorage) {
        setSavedMatches(JSON.parse(savedMatchesFromStorage));
      }
    } catch (error) {
      console.error('Error fetching saved matches:', error);
    }
  };

  const handleSaveMatch = async (user) => {
    if (!savedMatches.find(match => match.id === user.id)) {
      const updatedMatches = [...savedMatches, user];
      setSavedMatches(updatedMatches);
      setHoney(prev => prev + 3); // Earn 3 honey for matching
      
      // Save to local storage (in a real app, this would be saved to backend)
      localStorage.setItem('savedMatches', JSON.stringify(updatedMatches));
      
      // Create a chat between users
      try {
        await axios.post('http://localhost:3000/chat', {
          user1Id: currentUserId,
          user2Id: user.id
        });
      } catch (error) {
        console.error('Error creating chat for match:', error);
      }
    }
  };

  const handleSendMessage = () => {
    setHoney(prev => prev + 1); // Earn 1 honey per message
  };

  const handleRemoveMatch = (userId) => {
    setSavedMatches(prev => prev.filter(match => match.id !== userId));
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
    if (newPicture) {
      localStorage.setItem('userProfilePicture', newPicture);
    } else {
      localStorage.removeItem('userProfilePicture');
    }
  };

  const handleNavigateToProfile = () => {
    setActiveView('profile');
    setShowProfileDropdown(false);
  };

  const handleColonyClick = () => {
    setActiveView('map');
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userAge');
    localStorage.removeItem('userLocation');
    localStorage.removeItem('userDescription');
    localStorage.removeItem('userInterests');
    localStorage.removeItem('userProfilePicture');
    localStorage.removeItem('savedMatches');
    
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
            </div>
          </div>
        </div>
      );
    }

    switch (activeView) {
      case 'feed':
        return <Feed onSaveMatch={handleSaveMatch} currentColony={currentColony} />;
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
