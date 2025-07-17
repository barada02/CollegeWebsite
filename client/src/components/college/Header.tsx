import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../shared/Button';
import './Header.css';

export const CollegeHeader: React.FC = () => {
  return (
    <header className="college-header">
      <div className="container">
        <div className="header-content">
          {/* Logo and College Name */}
          <div className="logo-section">
            <Link to="/" className="logo-link">
              <div className="logo-placeholder">
                <img src="/src/assets/white-logo.png" alt="Aurora University Logo" className="logo-image" />
              </div>
              <div className="college-info">
                <h1 className="college-name">Aurora University</h1>
                <p className="college-tagline">Building Tomorrow's Leaders</p>
              </div>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="main-nav">
            <div className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/about" className="nav-link">About</Link>
              <Link to="/academics" className="nav-link">Academics</Link>
              <Link to="/faculty" className="nav-link">Faculty</Link>
              <Link to="/admissions" className="nav-link">Admissions</Link>
              <Link to="/contact" className="nav-link">Contact</Link>
            </div>
            
            {/* Admin Login Button */}
            <div className="auth-section">
              <Link to="/admin/login">
                <Button variant="college" size="sm">
                  Admin Login
                </Button>
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button (for future implementation) */}
          <div className="mobile-menu-btn">
            <span className="menu-icon">☰</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CollegeHeader;
