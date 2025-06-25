import React from 'react';
import './About.css';

export const About: React.FC = () => {
  return (
    <div className="about-page">
      <div className="container">
        {/* Hero Section */}
        <section className="about-hero">
          <h1 className="page-title">About Excellence University</h1>
          <p className="page-subtitle">
            Empowering minds, shaping futures, and building tomorrow's leaders since 1985.
          </p>
        </section>

        {/* Quick Overview */}
        <section className="about-overview">
          <div className="overview-grid">
            <div className="overview-card">
              <h3>Our Mission</h3>
              <p>To provide world-class education and foster innovation in a nurturing environment.</p>
            </div>
            <div className="overview-card">
              <h3>Our Vision</h3>
              <p>To be a leading institution that transforms lives through quality education and research.</p>
            </div>
            <div className="overview-card">
              <h3>Our Values</h3>
              <p>Excellence, Integrity, Innovation, and Inclusivity in everything we do.</p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="about-stats">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">15,000+</div>
              <div className="stat-label">Students</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Faculty</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Programs</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">35+</div>
              <div className="stat-label">Years of Excellence</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
