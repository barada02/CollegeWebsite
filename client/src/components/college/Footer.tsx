import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export const CollegeFooter: React.FC = () => {
  return (
    <footer className="college-footer">
      <div className="container">
        <div className="footer-content">
          {/* College Info */}
          <div className="footer-section">
            <div className="footer-logo">
              <div className="logo-placeholder">
                <img src="/src/assets/white-logo.png" alt="Aurora University Logo" className="logo-image" />
              </div>
              <div>
                <h3 className="footer-title">Aurora University</h3>
                <p className="footer-subtitle">Building Tomorrow's Leaders</p>
              </div>
            </div>
            <p className="footer-description">
              Aurora University is committed to providing world-class education 
              and fostering innovation, research, and community engagement.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="section-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/admissions">Admissions</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Academics */}
          <div className="footer-section">
            <h4 className="section-title">Academics</h4>
            <ul className="footer-links">
              <li><a href="#programs">Programs</a></li>
              <li><a href="#faculties">Faculties</a></li>
              <li><a href="#research">Research</a></li>
              <li><a href="#library">Library</a></li>
              <li><a href="#calendar">Academic Calendar</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 Aurora University. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <Link to="/admin/login">Admin Portal</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CollegeFooter;
