import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Query the backend to find user with matching username and password
      const response = await axios.get('http://localhost:3000/users', {
        params: {
          search: username,
          passwordSearch: password,
          fullObject: 'true'
        }
      });

      if (response.data && response.data.length > 0) {
        // User found - login successful
        const userData = response.data[0];
        
        // Store user data in sessionStorage
        sessionStorage.setItem('currentUserId', userData._id);
        sessionStorage.setItem('currentUserEmail', userData.email || username);
        sessionStorage.setItem('userName', userData.name || username);
        sessionStorage.setItem('userHoney', userData.honey || 10);
        sessionStorage.setItem('userColony', userData.currentColony || 'honeycomb');
        
        console.log('Login successful for user:', userData._id);
        navigate('/menu');
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 404) {
        setError('Invalid username or password');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1 className="login-title">Welcome to Bumblebee</h1>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <div className="signup-link">
          <span>Don't have an account? </span>
          <Link to="/signup">Sign up here</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
