import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Feed from '../Feed/Feed';
import Search from '../Search/Search';
import Profile from '../Profile/Profile';
import Hive from '../Hive/Hive';
import Messages from '../Messages/Messages';
import Map from '../Map/Map';
import { tagColonies, getUserColonies } from '../../services/api.js';
import './Menu.css';

const Menu = () => {
  const [activeView, setActiveView] = useState('default');
  const [savedMatches, setSavedMatches] = useState([]);
  const [viewingProfile, setViewingProfile] = useState(null);
  const [previousView, setPreviousView] = useState(null);
  const [selectedMatchForMessage, setSelectedMatchForMessage] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [honey, setHoney] = useState(10);
  const [currentColony, setCurrentColony] = useState('politics'); // Use Debate District as default
  const [userProfilePicture, setUserProfilePicture] = useState(null);
  const [userColonies, setUserColonies] = useState({});
  const [currentUserId] = useState(sessionStorage.getItem('currentUserId'));
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const getColonyInfo = (colonyId) => {
    if (!colonyId || colonyId === 'undefined' || colonyId === 'null') {
      return { 
        name: 'Debate District', 
        color: '#636e72',
        icon: '🏛️'
      };
    }
    // First check user's personalized colonies, then fall back to tag colonies
    return userColonies[colonyId] || tagColonies[colonyId] || { 
      name: 'Debate District',
      color: '#636e72',
      icon: '🏛️'
    };
  };

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

  useEffect(() => {
    const loadUserColonies = async () => {
      if (!currentUserId) return;
      
      try {
        console.log('Menu: Loading user colonies...');
        
        const { getUserColonyFromTags } = await import('../../services/api');
        const primaryColony = await getUserColonyFromTags(currentUserId);
        
        if (primaryColony && tagColonies[primaryColony]) {
          setCurrentColony(primaryColony);
          console.log('Menu: Immediately set primary colony:', primaryColony);
        }
        
        const colonyData = await getUserColonies(currentUserId);
        if (colonyData) {
          setUserColonies(colonyData.colonies);
          const fullDataColony = colonyData.startingColony || primaryColony;
          if (fullDataColony !== primaryColony) {
            setCurrentColony(fullDataColony);
            console.log('Menu: Updated to full data colony:', fullDataColony);
          }
        } else {
          setUserColonies(tagColonies);
          console.log('Menu: Using fallback tag colonies with primary colony:', primaryColony);
        }
      } catch (error) {
        console.error('Menu: Error loading user colonies:', error);
        setUserColonies(tagColonies);
        setCurrentColony('politics'); 
      }
    };
    
    loadUserColonies();
  }, [currentUserId]);

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
        
        const userCurrentColony = response.data.currentColony;
        if (userCurrentColony && tagColonies[userCurrentColony] && currentColony === 'politics') {
          setCurrentColony(userCurrentColony);
          console.log('Menu: Updated colony from user data:', userCurrentColony);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setHoney(parseInt(sessionStorage.getItem('userHoney')) || 10);
      
      const sessionColony = sessionStorage.getItem('userPrimaryColony') || sessionStorage.getItem('userColony');
      if (sessionColony && tagColonies[sessionColony] && currentColony === 'politics') {
        setCurrentColony(sessionColony);
        console.log('Menu: Updated colony from session storage:', sessionColony);
      }
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
      console.log('Menu: Fetching profile for user:', currentUserId);
      const response = await axios.get('http://localhost:3000/profiles', {
        params: { searchUserId: currentUserId }
      });

      console.log('Menu: Profile response:', response.data);

      if (response.data && response.data.length > 0) {
        const profileData = response.data[0];
        console.log('Menu: Profile data:', profileData);
        
        if (profileData[1] && profileData[1].trim()) {
          console.log('Menu: Setting profile picture from backend');
          setUserProfilePicture(profileData[1]);
        } else {
          console.log('Menu: No profile picture found in backend');
          setUserProfilePicture(null);
        }
        
        if (profileData[4]) sessionStorage.setItem('userName', profileData[4]);
        if (profileData[5]) sessionStorage.setItem('currentUserEmail', profileData[5]);
        if (profileData[6]) sessionStorage.setItem('userLocation', profileData[6]);
        if (profileData[2]) sessionStorage.setItem('userAge', profileData[2].toString());
        if (profileData[3]) sessionStorage.setItem('userDescription', profileData[3]);
      } else {
        console.log('Menu: No profile data found');
        setUserProfilePicture(null);
      }
    } catch (error) {
      console.error('Menu: Error fetching user profile:', error);
      setUserProfilePicture(null);
    }
  };

  const fetchSavedMatches = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/matches/${currentUserId}`);
      if (response.data && response.data.length > 0) {
        const matchPromises = response.data.map(async (match) => {
          const otherUserId = match.user1Id === currentUserId ? match.user2Id : match.user1Id;
          try {
            const profileResponse = await axios.get('http://localhost:3000/profiles', {
              params: { searchUserId: otherUserId }
            });
            
            if (profileResponse.data && profileResponse.data.length > 0) {
              const profileData = profileResponse.data[0];
              
              const { getUserColonyFromTags } = await import('../../services/api');
              let userColony = await getUserColonyFromTags(otherUserId);
              
              if (!userColony || !tagColonies[userColony]) {
                userColony = 'politics'; 
              }
              
              return {
                id: otherUserId,
                name: profileData[4] || `User ${otherUserId}`,
                age: profileData[2] || 25,
                bio: profileData[3] || 'Looking for meaningful connections!',
                location: profileData[6] || 'City, State',
                colony: userColony,
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
    if (savedMatches.find(match => match.id === user.id)) {
      console.log('Already matched with this user');
      return Promise.resolve(); 
    }

    try {
      console.log('Saving match:', user.id, 'Current honey:', honey);
      
      const newHoney = honey + 3;
      console.log('New honey amount will be:', newHoney);
      
      setHoney(newHoney);
      
      await axios.post('http://localhost:3000/matches', {
        user1Id: currentUserId,
        user2Id: user.id,
        matchedAt: new Date().toISOString()
      });

      await axios.post('http://localhost:3000/chat', {
        user1Id: currentUserId,
        user2Id: user.id
      });

      const updatedMatches = [...savedMatches, user];
      setSavedMatches(updatedMatches);
      
      await updateUserData({ honey: newHoney });
      
      sessionStorage.setItem('userHoney', newHoney.toString());
      
      console.log('Match saved successfully, honey increased from', honey, 'to', newHoney);
      return Promise.resolve(); 
      
    } catch (error) {
      console.error('Error saving match:', error);
      
      const newHoney = honey + 3;
      
      const updatedMatches = [...savedMatches, user];
      setSavedMatches(updatedMatches);
      setHoney(newHoney);
      
      try {
        await updateUserData({ honey: newHoney });
        sessionStorage.setItem('userHoney', newHoney.toString());
      } catch (updateError) {
        console.error('Failed to update honey in backend:', updateError);
      }
      
      console.log('Match saved with fallback, honey increased to:', newHoney);
      return Promise.resolve(); 
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

  const handleProfilePictureUpdate = async (newPicture) => {
    console.log('Menu: Updating profile picture:', !!newPicture);
    setUserProfilePicture(newPicture);
    
    if (currentUserId) {
      try {
        await axios.put(`http://localhost:3000/profiles/${currentUserId}`, {
          profileImage: newPicture || ''
        });
        console.log('Menu: Profile picture updated in backend');
      } catch (error) {
        console.error('Menu: Error updating profile picture in backend:', error);
      }
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
                    <span className="colony-badge" style={{ backgroundColor: getColonyInfo(viewingProfile.colony).color }}>
                      🏛️ {getColonyInfo(viewingProfile.colony).name}
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
              <span className="colony-badge" style={{ backgroundColor: getColonyInfo(currentColony).color }}>
                🏛️ {getColonyInfo(currentColony).name}
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
