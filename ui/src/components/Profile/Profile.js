import React, { useState, useEffect } from 'react';
import { colonies, profileAPI, utils } from '../../services/api';
import './Profile.css';
import axios from 'axios';


const Profile = ({ currentColony, userProfilePicture, onProfilePictureUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [previewImage, setPreviewImage] = useState(userProfilePicture);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({
    name: sessionStorage.getItem('userName') || 'John Doe',
    email: sessionStorage.getItem('currentUserEmail') || 'john@example.com',
    age: sessionStorage.getItem('userAge') || '25',
    location: sessionStorage.getItem('userLocation') || 'San Francisco, CA',
    description: sessionStorage.getItem('userDescription') || 'Love exploring new places and meeting new people!'
  });
  const [currentUserId] = useState(sessionStorage.getItem('currentUserId'));

  useEffect(() => {
    setPreviewImage(userProfilePicture);
  }, [userProfilePicture]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setError('');

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = () => {
    onProfilePictureUpdate(previewImage);
    setShowPhotoUpload(false);
  };

  const handleCancelPhoto = () => {
    setPreviewImage(userProfilePicture);
    setShowPhotoUpload(false);
    setError('');
  };

  const handleRemovePhoto = () => {
    setPreviewImage(null);
    onProfilePictureUpdate(null);
    setShowPhotoUpload(false);
  };

  const handleSaveProfile = async () => {
    try {
      console.log('Profile: Saving profile changes...');
      
      // Save to backend
      if (currentUserId) {
        const profileUpdateData = {
          profileImage: previewImage,
          age: parseInt(profileData.age),
          Description: profileData.description,
          name: profileData.name,
          email: profileData.email,
          location: profileData.location
        };
        
        console.log('Profile: Sending update data:', profileUpdateData);
        
        try {
          const response = await axios.put(`http://localhost:3000/profiles/${currentUserId}`, profileUpdateData);
          console.log('Profile: Backend update successful:', response.data);
        } catch (backendError) {
          console.error('Profile: Backend update failed:', backendError);
          // Continue with local storage update even if backend fails
        }

        // Save to sessionStorage for immediate UI updates
        sessionStorage.setItem('userName', profileData.name);
        sessionStorage.setItem('currentUserEmail', profileData.email);
        sessionStorage.setItem('userAge', profileData.age.toString());
        sessionStorage.setItem('userLocation', profileData.location);
        sessionStorage.setItem('userDescription', profileData.description);
        
        console.log('Profile: Session storage updated');

        // Update parent component with new profile picture
        if (onProfilePictureUpdate && previewImage !== userProfilePicture) {
          onProfilePictureUpdate(previewImage);
        }

        // Exit editing mode
        setIsEditing(false);
        console.log('Profile: Profile saved successfully');
      } else {
        console.error('Profile: No current user ID found');
        alert('Error: User not logged in');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2 className="profile-title">My Profile</h2>
        <button
          className="edit-profile-btn"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : '✏️ Edit Profile'}
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-photo-section">
          <div className="profile-photo-container">
            {previewImage ? (
              <img src={previewImage} alt="Profile" className="profile-photo" />
            ) : (
              <div className="profile-photo-placeholder">
                <div className="photo-placeholder-icon">📷</div>
                <p>No photo</p>
              </div>
            )}
          </div>

          <button
            className="change-photo-btn"
            onClick={() => setShowPhotoUpload(true)}
          >
            📷 Change Photo
          </button>
        </div>

        <div className="profile-details">
          <div className="profile-field">
            <label>Name</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="profile-input"
              />
            ) : (
              <span className="profile-value">{profileData.name}</span>
            )}
          </div>

          <div className="profile-field">
            <label>Email</label>
            {isEditing ? (
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="profile-input"
              />
            ) : (
              <span className="profile-value">{profileData.email}</span>
            )}
          </div>

          <div className="profile-field">
            <label>Age</label>
            {isEditing ? (
              <input
                type="number"
                value={profileData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className="profile-input"
                min="18"
                max="100"
              />
            ) : (
              <span className="profile-value">{profileData.age}</span>
            )}
          </div>

          <div className="profile-field">
            <label>Location</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="profile-input"
              />
            ) : (
              <span className="profile-value">{profileData.location}</span>
            )}
          </div>

          <div className="profile-field">
            <label>About Me</label>
            {isEditing ? (
              <textarea
                value={profileData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="profile-textarea"
                rows="4"
              />
            ) : (
              <span className="profile-value">{profileData.description}</span>
            )}
          </div>

          <div className="profile-field">
            <label>Colony</label>
            <div className="colony-info">
              <span className="colony-badge" style={{ backgroundColor: colonies[currentColony].color }}>
                🏛️ {colonies[currentColony].name}
              </span>
            </div>
          </div>

          {isEditing && (
            <div className="profile-actions">
              <button className="save-btn" onClick={handleSaveProfile}>
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Photo Upload Modal */}
      {showPhotoUpload && (
        <div className="modal-overlay">
          <div className="photo-upload-modal">
            <div className="modal-header">
              <h3>Change Profile Photo</h3>
              <button className="close-btn" onClick={handleCancelPhoto}>✕</button>
            </div>

            <div className="modal-content">
              <div className="photo-preview">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="preview-photo" />
                ) : (
                  <div className="preview-placeholder">
                    <div className="upload-icon">📷</div>
                    <p>No photo selected</p>
                  </div>
                )}
              </div>

              <div className="upload-actions">
                <input
                  type="file"
                  id="photoUpload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input-hidden"
                />
                <label htmlFor="photoUpload" className="upload-btn">
                  📷 Choose Photo
                </label>

                {previewImage && (
                  <button className="remove-photo-btn" onClick={handleRemovePhoto}>
                    🗑️ Remove Photo
                  </button>
                )}
              </div>

              {error && <div className="error-message">{error}</div>}
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={handleCancelPhoto}>Cancel</button>
              <button className="save-photo-btn" onClick={handleSavePhoto}>Save Photo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default Profile;
