import React from 'react';
import './Info.css';

function Info() {
  return (
    <div className="bb-info-container">
      <div className="bb-info-content">
        <h2 className="bb-info-title">About Bumblebee</h2>
        <p className="bb-info-desc">
          Bumblebee leverages cutting-edge AI to help you find meaningful relationships.<br />
          Our platform is designed for efficiency, privacy, and fun.<br />
          Learn more about our technology, safety features, and how we keep your data secure.
        </p>
        <ul className="bb-info-list">
          <li>🤖 Advanced AI matchmaking</li>
          <li>🛡️ Secure & private messaging</li>
          <li>🌐 Community guidelines for safety</li>
        </ul>
      </div>
    </div>
  );
}

export default Info;