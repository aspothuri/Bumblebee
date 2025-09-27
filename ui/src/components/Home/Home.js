import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="bb-home-container">
      <div className="bb-home-content">
        <h1 className="bb-home-title">Meet Your Match, Powered by AI</h1>
        <p className="bb-home-desc">
          Bumblebee is an AI-powered dating platform designed to connect people efficiently and meaningfully.<br />
          Our intelligent matching system learns your preferences and helps you find genuine connections faster.<br />
          Experience a sleek, secure, and fun way to meet new people—let our AI do the buzzing for you!
        </p>
        <ul className="bb-home-features">
          <li>⚡ Smart, real-time matchmaking</li>
          <li>🔒 Privacy-first design</li>
          <li>💬 Instant messaging & icebreakers</li>
          <li>🎯 Personalized recommendations</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;