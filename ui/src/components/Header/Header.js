import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="bb-header">
      <div className="bb-logo">
        <Link to="/" className="bb-logo-link">🐝 Bumblebee</Link>
      </div>
      <nav className="bb-nav">
        <Link to="/" className="bb-nav-link">Home</Link>
        <Link to="/login" className="bb-nav-link">Login</Link>
        <Link to="/info" className="bb-nav-link">Info</Link>
      </nav>
    </header>
  );
}

export default Header;