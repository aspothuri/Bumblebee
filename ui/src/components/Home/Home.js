import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="bb-home-container">
      <div className="bb-home-content">
        <div className="bb-hero-section">
          <h1 className="bb-home-title">🐝 Welcome to Bumblebee</h1>
          <p className="bb-home-subtitle">
            AI-Powered Dating That Actually Works
          </p>
          <p className="bb-home-desc">
            Find meaningful connections through smart matching, themed communities, and gamified dating. 
            Our AI learns your preferences to deliver better matches every swipe.
          </p>
        </div>

        <div className="bb-features-grid">
          <div className="bb-feature-section">
            <h2 className="bb-section-title">🎯 Smart Matching</h2>
            <div className="bb-feature-list">
              <div className="bb-feature-item">
                <span className="bb-feature-icon">🤖</span>
                <div className="bb-feature-content">
                  <h3>AI-Powered Compatibility</h3>
                  <p>Advanced algorithms analyze your behavior and preferences to find perfect matches with up to 95% accuracy.</p>
                </div>
              </div>
              <div className="bb-feature-item">
                <span className="bb-feature-icon">🍯</span>
                <div className="bb-feature-content">
                  <h3>Interactive Feed</h3>
                  <p>Swipe with "Buzz Off" or "You're Bee-utiful" - earn honey points for every interaction that unlock new features.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bb-feature-section">
            <h2 className="bb-section-title">🏛️ Colony Communities</h2>
            <div className="bb-feature-list">
              <div className="bb-feature-item">
                <span className="bb-feature-icon">🗺️</span>
                <div className="bb-feature-content">
                  <h3>Themed Communities</h3>
                  <p>Adventure Peak for thrill-seekers, Artisan Alley for creatives, Tech Hive for innovators - find your tribe!</p>
                </div>
              </div>
              <div className="bb-feature-item">
                <span className="bb-feature-icon">🔓</span>
                <div className="bb-feature-content">
                  <h3>Progressive Unlocking</h3>
                  <p>Stay active to unlock new colonies and expand your dating horizons across different interest communities.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bb-feature-section">
            <h2 className="bb-section-title">💬 Connect & Chat</h2>
            <div className="bb-feature-list">
              <div className="bb-feature-item">
                <span className="bb-feature-icon">🏠</span>
                <div className="bb-feature-content">
                  <h3>Your Personal Hive</h3>
                  <p>Manage matches, view profiles, and track conversations in one beautiful, organized interface.</p>
                </div>
              </div>
              <div className="bb-feature-item">
                <span className="bb-feature-icon">🛡️</span>
                <div className="bb-feature-content">
                  <h3>Secure & Private</h3>
                  <p>Encrypted messaging, privacy controls, and safe photo sharing - your data stays protected.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bb-feature-section">
            <h2 className="bb-section-title">🎮 Gamified Experience</h2>
            <div className="bb-feature-list">
              <div className="bb-feature-item">
                <span className="bb-feature-icon">🏆</span>
                <div className="bb-feature-content">
                  <h3>Honey Rewards System</h3>
                  <p>Earn honey for swiping, matching, and messaging. Use points to unlock colonies and premium features.</p>
                </div>
              </div>
              <div className="bb-feature-item">
                <span className="bb-feature-icon">📊</span>
                <div className="bb-feature-content">
                  <h3>Live Compatibility Scores</h3>
                  <p>See real-time compatibility percentages based on shared interests, values, and conversation patterns.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bb-cta-section">
          <h2 className="bb-cta-title">Ready to Find Your Match?</h2>
          <p className="bb-cta-desc">
            Join thousands finding real connections through AI-powered matching and community-based dating.
          </p>
          <div className="bb-stats">
            <div className="bb-stat-item">
              <span className="bb-stat-number">10K+</span>
              <span className="bb-stat-label">Active Users</span>
            </div>
            <div className="bb-stat-item">
              <span className="bb-stat-number">5</span>
              <span className="bb-stat-label">Unique Colonies</span>
            </div>
            <div className="bb-stat-item">
              <span className="bb-stat-number">95%</span>
              <span className="bb-stat-label">Match Satisfaction</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;