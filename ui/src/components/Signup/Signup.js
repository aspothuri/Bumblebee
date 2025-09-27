import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    location: '',
    description: '',
    interests: [],
    profilePicture: null
  });

  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [availableInterests] = useState([
    'Technology', 'Art', 'Music', 'Sports', 'Travel', 'Cooking', 'Reading', 
    'Photography', 'Dancing', 'Hiking', 'Gaming', 'Fitness', 'Movies', 
    'Fashion', 'Food', 'Nature', 'Writing', 'Yoga', 'Adventure', 'Coffee'
  ]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          profilePicture: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)'
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          profilePicture: 'Image size must be less than 5MB'
        }));
        return;
      }

      // Clear any previous errors
      setErrors(prev => ({
        ...prev,
        profilePicture: undefined
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);

      setFormData(prev => ({
        ...prev,
        profilePicture: file
      }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      profilePicture: null
    }));
    setPreviewImage(null);
    // Reset file input
    const fileInput = document.getElementById('profilePicture');
    if (fileInput) fileInput.value = '';
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.age || formData.age < 18 || formData.age > 100) {
      newErrors.age = 'Please enter a valid age (18-100)';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please tell us about yourself';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description should be at least 20 characters';
    }

    if (formData.interests.length < 3) {
      newErrors.interests = 'Please select at least 3 interests';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      // Store profile picture in localStorage for demo purposes
      if (formData.profilePicture && previewImage) {
        localStorage.setItem('userProfilePicture', previewImage);
      }
      
      // Store user data for demo purposes
      localStorage.setItem('userName', formData.name);
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userAge', formData.age);
      localStorage.setItem('userLocation', formData.location);
      localStorage.setItem('userDescription', formData.description);
      localStorage.setItem('userInterests', JSON.stringify(formData.interests));
      
      console.log('Signup successful:', {
        name: formData.name,
        email: formData.email,
        age: formData.age,
        location: formData.location,
        interests: formData.interests,
        hasProfilePicture: !!formData.profilePicture
      });
      
      navigate('/menu');
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h1 className="signup-title">Join the Hive</h1>
        <form onSubmit={handleSubmit}>
          {/* Profile Picture Upload */}
          <div className="form-group">
            <label htmlFor="profilePicture">Profile Picture (Optional)</label>
            <div className="profile-picture-upload">
              {previewImage ? (
                <div className="image-preview">
                  <img src={previewImage} alt="Profile preview" className="preview-image" />
                  <button type="button" onClick={removeImage} className="remove-image-btn">
                    ✕
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-icon">📷</div>
                  <p>Click to upload a profile picture</p>
                </div>
              )}
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input"
              />
            </div>
            {errors.profilePicture && <span className="error-message">{errors.profilePicture}</span>}
            <small className="helper-text">Supported formats: JPEG, PNG, GIF, WebP (Max 5MB)</small>
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                min="18"
                max="100"
                value={formData.age}
                onChange={handleChange}
                className={errors.age ? 'error' : ''}
              />
              {errors.age && <span className="error-message">{errors.age}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="City, State"
                value={formData.location}
                onChange={handleChange}
                className={errors.location ? 'error' : ''}
              />
              {errors.location && <span className="error-message">{errors.location}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Tell us about yourself</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              placeholder="Describe your interests, hobbies, what you're looking for..."
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
            <small className="helper-text">This helps us understand you better (minimum 20 characters)</small>
          </div>

          <div className="form-group">
            <label>Select Your Interests (minimum 3)</label>
            <div className="interests-grid">
              {availableInterests.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={`interest-chip ${formData.interests.includes(interest) ? 'selected' : ''}`}
                >
                  {interest}
                </button>
              ))}
            </div>
            {errors.interests && <span className="error-message">{errors.interests}</span>}
            <small className="helper-text">Selected: {formData.interests.length}</small>
          </div>

          <button type="submit" className="signup-button">
            Create Account
          </button>
        </form>

        <div className="login-link">
          <span>Already have an account? </span>
          <Link to="/login">Log in here</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;