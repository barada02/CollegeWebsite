import React from 'react';
import Button from '../../components/shared/Button';
import './ManageAbout.css';

export const ManageAbout: React.FC = () => {
  return (
    <div className="manage-about-page">
      <div className="page-header">
        <h1 className="page-title">About Management</h1>
        <p className="page-subtitle">Manage college information, mission, vision, and statistics</p>
      </div>

      {/* College Information */}
      <section className="content-section">
        <div className="section-header">
          <h2>College Information</h2>
          <Button variant="admin" size="sm">Edit Information</Button>
        </div>
        <div className="info-grid">
          <div className="info-card">
            <h3>Mission Statement</h3>
            <p>To provide world-class education and foster innovation in a nurturing environment that prepares students for successful careers and meaningful lives.</p>
            <div className="card-actions">
              <Button variant="admin" size="sm">Edit</Button>
            </div>
          </div>
          <div className="info-card">
            <h3>Vision Statement</h3>
            <p>To be a leading institution that transforms lives through quality education, research, and community engagement.</p>
            <div className="card-actions">
              <Button variant="admin" size="sm">Edit</Button>
            </div>
          </div>
          <div className="info-card">
            <h3>College Values</h3>
            <p>Excellence, Integrity, Innovation, Inclusivity, and Impact in everything we do.</p>
            <div className="card-actions">
              <Button variant="admin" size="sm">Edit</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="content-section">
        <div className="section-header">
          <h2>College Statistics</h2>
          <Button variant="admin" size="sm">Update Stats</Button>
        </div>
        <div className="stats-management">
          <div className="stat-item">
            <label>Total Students</label>
            <input type="number" value="15000" readOnly />
            <Button variant="admin" size="sm">Edit</Button>
          </div>
          <div className="stat-item">
            <label>Faculty Members</label>
            <input type="number" value="500" readOnly />
            <Button variant="admin" size="sm">Edit</Button>
          </div>
          <div className="stat-item">
            <label>Academic Programs</label>
            <input type="number" value="50" readOnly />
            <Button variant="admin" size="sm">Edit</Button>
          </div>
          <div className="stat-item">
            <label>Years of Excellence</label>
            <input type="number" value="35" readOnly />
            <Button variant="admin" size="sm">Edit</Button>
          </div>
        </div>
      </section>

      {/* History & Achievements */}
      <section className="content-section">
        <div className="section-header">
          <h2>History & Achievements</h2>
          <Button variant="admin" size="sm">Add Achievement</Button>
        </div>
        <div className="achievements-list">
          <div className="achievement-item">
            <div className="achievement-content">
              <h3>Established</h3>
              <p>Founded in 1985 with a commitment to academic excellence</p>
              <span className="achievement-date">1985</span>
            </div>
            <div className="achievement-actions">
              <Button variant="admin" size="sm">Edit</Button>
            </div>
          </div>
          <div className="achievement-item">
            <div className="achievement-content">
              <h3>Accreditation</h3>
              <p>Received full accreditation from National Education Board</p>
              <span className="achievement-date">1995</span>
            </div>
            <div className="achievement-actions">
              <Button variant="admin" size="sm">Edit</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ManageAbout;
