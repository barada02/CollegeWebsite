import React from 'react';
import Button from '../../components/shared/Button';
import './ManageFaculty.css';

export const ManageFaculty: React.FC = () => {
  const mockFaculty = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      department: 'Computer Science',
      position: 'Professor',
      email: 'sarah.johnson@university.edu',
      phone: '+1 (555) 123-4567',
      experience: '15 years',
      status: 'active'
    },
    {
      id: 2,
      name: 'Prof. Michael Chen',
      department: 'Business Administration',
      position: 'Associate Professor',
      email: 'michael.chen@university.edu',
      phone: '+1 (555) 234-5678',
      experience: '12 years',
      status: 'active'
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      department: 'Engineering',
      position: 'Assistant Professor',
      email: 'emily.rodriguez@university.edu',
      phone: '+1 (555) 345-6789',
      experience: '8 years',
      status: 'on_leave'
    }
  ];

  const departments = [
    { name: 'Computer Science', faculty: 15 },
    { name: 'Business Administration', faculty: 12 },
    { name: 'Engineering', faculty: 18 },
    { name: 'Arts & Sciences', faculty: 22 },
    { name: 'Health Sciences', faculty: 10 },
    { name: 'Education', faculty: 8 }
  ];

  return (
    <div className="manage-faculty-page">
      <div className="page-header">
        <h1 className="page-title">Faculty Management</h1>
        <p className="page-subtitle">Manage faculty members, departments, and academic staff</p>
      </div>

      {/* Action Bar */}
      <div className="action-bar">
        <div className="search-section">
          <input type="text" placeholder="Search faculty..." className="search-input" />
          <select className="filter-select">
            <option value="all">All Departments</option>
            <option value="cs">Computer Science</option>
            <option value="business">Business</option>
            <option value="engineering">Engineering</option>
            <option value="arts">Arts & Sciences</option>
          </select>
        </div>
        <Button variant="admin" size="md">Add New Faculty</Button>
      </div>

      {/* Department Overview */}
      <section className="department-overview">
        <h2 className="section-title">Department Overview</h2>
        <div className="departments-grid">
          {departments.map((dept, index) => (
            <div key={index} className="department-card">
              <h3 className="department-name">{dept.name}</h3>
              <div className="department-stats">
                <div className="stat-item">
                  <span className="stat-number">{dept.faculty}</span>
                  <span className="stat-label">Faculty Members</span>
                </div>
              </div>
              <div className="department-actions">
                <Button variant="admin" size="sm">View All</Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Faculty List */}
      <section className="faculty-list">
        <div className="list-header">
          <h2>Faculty Members</h2>
          <div className="list-stats">
            <span className="total-count">{mockFaculty.length} total faculty</span>
          </div>
        </div>
        
        <div className="faculty-grid">
          {mockFaculty.map(faculty => (
            <div key={faculty.id} className="faculty-card">
              <div className="faculty-avatar">
                <span className="avatar-placeholder">👤</span>
              </div>
              <div className="faculty-info">
                <h3 className="faculty-name">{faculty.name}</h3>
                <div className="faculty-details">
                  <div className="detail-item">
                    <span className="detail-label">Department:</span>
                    <span className="detail-value">{faculty.department}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Position:</span>
                    <span className="detail-value">{faculty.position}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Experience:</span>
                    <span className="detail-value">{faculty.experience}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{faculty.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{faculty.phone}</span>
                  </div>
                </div>
                <div className="faculty-status">
                  <span className={`status-badge ${faculty.status}`}>
                    {faculty.status === 'active' ? 'Active' : 'On Leave'}
                  </span>
                </div>
              </div>
              <div className="faculty-actions">
                <Button variant="admin" size="sm">Edit</Button>
                <Button variant="admin" size="sm">View Profile</Button>
                <Button variant="admin" size="sm">Contact</Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ManageFaculty;
