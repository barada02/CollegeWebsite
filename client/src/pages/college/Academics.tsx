import React from 'react';
import './Academics.css';

export const Academics: React.FC = () => {
  return (
    <div className="academics-page">
      <div className="container">
        {/* Hero Section */}
        <section className="academics-hero">
          <h1 className="page-title">Academics</h1>
          <p className="page-subtitle">
            Discover our comprehensive range of academic programs designed to prepare you for success.
          </p>
        </section>

        {/* Programs Overview */}
        <section className="programs-overview">
          <h2 className="section-title">Academic Programs</h2>
          <div className="programs-grid">
            <div className="program-card">
              <div className="program-icon">🎓</div>
              <h3>Undergraduate Programs</h3>
              <p>Bachelor's degrees across 25+ disciplines including Business, Engineering, Arts, and Sciences.</p>
              <div className="program-stats">
                <span>25+ Programs</span>
                <span>4-Year Degrees</span>
              </div>
            </div>
            <div className="program-card">
              <div className="program-icon">📚</div>
              <h3>Graduate Programs</h3>
              <p>Master's and Doctoral programs for advanced study and research opportunities.</p>
              <div className="program-stats">
                <span>15+ Programs</span>
                <span>Masters & PhD</span>
              </div>
            </div>
            <div className="program-card">
              <div className="program-icon">💼</div>
              <h3>Professional Programs</h3>
              <p>Specialized programs for working professionals and continuing education.</p>
              <div className="program-stats">
                <span>10+ Programs</span>
                <span>Certificates</span>
              </div>
            </div>
          </div>
        </section>

        {/* Academic Departments */}
        <section className="departments-section">
          <h2 className="section-title">Academic Departments</h2>
          <div className="departments-grid">
            <div className="department-item">
              <h3>School of Business</h3>
              <p>Business Administration, Finance, Marketing, Management</p>
            </div>
            <div className="department-item">
              <h3>School of Engineering</h3>
              <p>Computer Science, Mechanical, Electrical, Civil Engineering</p>
            </div>
            <div className="department-item">
              <h3>School of Arts & Sciences</h3>
              <p>Liberal Arts, Natural Sciences, Social Sciences, Humanities</p>
            </div>
            <div className="department-item">
              <h3>School of Health Sciences</h3>
              <p>Nursing, Public Health, Healthcare Administration</p>
            </div>
            <div className="department-item">
              <h3>School of Education</h3>
              <p>Elementary Education, Secondary Education, Educational Leadership</p>
            </div>
            <div className="department-item">
              <h3>School of Law</h3>
              <p>Juris Doctor, Legal Studies, International Law</p>
            </div>
          </div>
        </section>

        {/* Academic Resources */}
        <section className="resources-section">
          <h2 className="section-title">Academic Resources</h2>
          <div className="resources-grid">
            <div className="resource-card">
              <div className="resource-icon">📖</div>
              <h3>Library Services</h3>
              <p>Comprehensive digital and physical collections with 24/7 access.</p>
            </div>
            <div className="resource-card">
              <div className="resource-icon">🔬</div>
              <h3>Research Centers</h3>
              <p>State-of-the-art laboratories and research facilities.</p>
            </div>
            <div className="resource-card">
              <div className="resource-icon">👨‍🏫</div>
              <h3>Academic Support</h3>
              <p>Tutoring, mentoring, and academic counseling services.</p>
            </div>
            <div className="resource-card">
              <div className="resource-icon">💻</div>
              <h3>Online Learning</h3>
              <p>Flexible online and hybrid learning options available.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Academics;
