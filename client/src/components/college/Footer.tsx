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
                <span className="logo-text">📚</span>
              </div>
              <div>
                <h3 className="footer-title">Excellence University</h3>
                <p className="footer-subtitle">Building Tomorrow's Leaders</p>
              </div>
            </div>
            <p className="footer-description">
              Excellence University is committed to providing world-class education 
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

          {/* Contact Info */}
          <div className="footer-section">
            <h4 className="section-title">Contact Info</h4>
            <div className="contact-info">
              <p>📍 123 University Avenue<br />Education City, EC 12345</p>
              <p>📞 +1 (555) 123-4567</p>
              <p>✉️ info@excellenceuniversity.edu</p>
            </div>
            <div className="social-links">
              <a href="#facebook" className="social-link">📘</a>
              <a href="#twitter" className="social-link">🐦</a>
              <a href="#linkedin" className="social-link">💼</a>
              <a href="#instagram" className="social-link">📷</a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 Excellence University. All rights reserved.</p>
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
