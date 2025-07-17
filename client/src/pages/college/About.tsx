import React from 'react';
import { useAboutData } from '../../hooks/useAboutData';
import './About.css';

export const About: React.FC = () => {
  const { aboutData, loading, error } = useAboutData();

  if (loading) {
    return (
      <div className="about-page">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading about information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !aboutData) {
    return (
      <div className="about-page">
        <div className="container">
          <div className="error-state">
            <h2>Unable to Load Information</h2>
            <p>We're experiencing technical difficulties. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="about-page">
      <div className="container">
        {/* Hero Section */}
        <section className="about-hero">
          <h1 className="page-title">About Aurora University</h1>
          <p className="page-subtitle">
            Empowering minds, shaping futures, and building tomorrow's leaders since 1985.
          </p>
        </section>

        {/* Quick Overview */}
        <section className="about-overview">
          <div className="overview-grid">
            <div className="overview-card">
              <h3>Our Mission</h3>
              <p>{aboutData.mission}</p>
            </div>
            <div className="overview-card">
              <h3>Our Vision</h3>
              <p>{aboutData.vision}</p>
            </div>
            <div className="overview-card">
              <h3>Our Values</h3>
              <p>{aboutData.values}</p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="about-stats">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{aboutData.stats.students.toLocaleString()}+</div>
              <div className="stat-label">Students</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{aboutData.stats.faculty.toLocaleString()}+</div>
              <div className="stat-label">Faculty</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{aboutData.stats.programs}+</div>
              <div className="stat-label">Programs</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{aboutData.stats.yearsOfExcellence}+</div>
              <div className="stat-label">Years of Service</div>
            </div>
          </div>
        </section>

        {/* History Section */}
        <section className="about-history">
          <div className="section-content">
            <h2>Our History</h2>
            <p className="history-text">{aboutData.history}</p>
          </div>
        </section>

        {/* Achievements Section */}
        {aboutData.achievements && aboutData.achievements.length > 0 && (
          <section className="about-achievements">
            <div className="section-content">
              <h2>Our Achievements</h2>
              <div className="achievements-timeline">
                {aboutData.achievements
                  .sort((a, b) => b.year - a.year)
                  .map((achievement, index) => (
                    <div key={achievement._id || index} className="achievement-item">
                      <div className="achievement-year">{achievement.year}</div>
                      <div className="achievement-content">
                        <h3>{achievement.title}</h3>
                        <p>{achievement.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* Leadership Section */}
        {aboutData.leadership && aboutData.leadership.length > 0 && (
          <section className="about-leadership">
            <div className="section-content">
              <h2>Our Leadership</h2>
              <div className="leadership-grid">
                {aboutData.leadership.map((leader, index) => (
                  <div key={leader._id || index} className="leader-card">
                    <div className="leader-info">
                      <h3>{leader.name}</h3>
                      <h4>{leader.position}</h4>
                      <p>{leader.bio}</p>
                      {leader.email && (
                        <div className="leader-contact">
                          <a href={`mailto:${leader.email}`}>Contact</a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default About;
