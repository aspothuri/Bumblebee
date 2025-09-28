import React, { useState, useEffect } from 'react';
import { colonies, profileAPI, utils } from '../../services/api';
import './Profile.css';

const Profile = ({ currentColony, userProfilePicture, onProfilePictureUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [previewImage, setPreviewImage] = useState(userProfilePicture);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({
    name: localStorage.getItem('userName') || 'John Doe',
    email: localStorage.getItem('userEmail') || 'john@example.com',
    age: localStorage.getItem('userAge') || '25',
    location: localStorage.getItem('userLocation') || 'San Francisco, CA',
    description: localStorage.getItem('userDescription') || 'Love exploring new places and meeting new people!',
    interests: JSON.parse(localStorage.getItem('userInterests') || '["Travel", "Photography", "Coffee"]')
  });
  const [currentUserId] = useState(localStorage.getItem('currentUserId'));

  useEffect(() => {
    setPreviewImage(userProfilePicture);
  }, [userProfilePicture]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      // Validate file size (max 5MB)
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
      // Save to backend
      if (currentUserId) {
        const result = await profileAPI.createProfile(currentUserId, {
          profileImage: previewImage,
          age: parseInt(profileData.age),
          Description: profileData.description
        });

        if (result.success) {
          // Save to localStorage for immediate UI updates
          utils.setCurrentUser({
            id: currentUserId,
            username: profileData.email,
            name: profileData.name,
            age: profileData.age,
            location: profileData.location,
            description: profileData.description,
            interests: profileData.interests,
            profilePicture: previewImage
          });

          setIsEditing(false);
        } else {
          console.error('Failed to save profile:', result.message);
        }
      }
    } catch (error) {
      console.error('Error saving profile:', error);
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

          <div className="profile-field">
            <label>Interests</label>
            <div className="interests-display">
              {profileData.interests.map((interest, index) => (
                <span key={index} className="interest-tag">{interest}</span>
              ))}
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
