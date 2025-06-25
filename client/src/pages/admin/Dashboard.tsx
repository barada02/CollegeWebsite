import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/shared/Button';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <p className="dashboard-subtitle">Welcome back! Manage your college website content.</p>
          </div>
          <div className="header-actions">
            <Link to="/">
              <Button variant="admin" size="sm">View College Website</Button>
            </Link>
            <Link to="/admin/login">
              <Button variant="admin" size="sm">Logout</Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📰</div>
            <div className="stat-content">
              <div className="stat-number">25</div>
              <div className="stat-label">Total Events</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-number">5</div>
              <div className="stat-label">Admin Users</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-number">1,234</div>
              <div className="stat-label">Page Views</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <div className="stat-number">12</div>
              <div className="stat-label">Pending Updates</div>
            </div>
          </div>
        </div>

        {/* Management Cards */}
        <div className="management-grid">
          <div className="management-card">
            <div className="card-header">
              <h3 className="card-title">📅 Events Management</h3>
              <span className="card-badge">25 Events</span>
            </div>
            <p className="card-description">
              Create, edit, and manage all college events. Add event details, dates, and locations.
            </p>
            <div className="card-actions">
              <Button variant="admin" size="sm">Manage Events</Button>
              <Button variant="admin" size="sm">Add New Event</Button>
            </div>
          </div>

          <div className="management-card">
            <div className="card-header">
              <h3 className="card-title">👥 User Management</h3>
              <span className="card-badge">5 Users</span>
            </div>
            <p className="card-description">
              Manage admin users, permissions, and access levels for the dashboard.
            </p>
            <div className="card-actions">
              <Button variant="admin" size="sm">Manage Users</Button>
              <Button variant="admin" size="sm">Add New User</Button>
            </div>
          </div>

          <div className="management-card">
            <div className="card-header">
              <h3 className="card-title">📊 Analytics</h3>
              <span className="card-badge">Live Data</span>
            </div>
            <p className="card-description">
              View website statistics, user engagement, and performance metrics.
            </p>
            <div className="card-actions">
              <Button variant="admin" size="sm">View Analytics</Button>
              <Button variant="admin" size="sm">Export Report</Button>
            </div>
          </div>

          <div className="management-card">
            <div className="card-header">
              <h3 className="card-title">⚙️ Settings</h3>
              <span className="card-badge">Configure</span>
            </div>
            <p className="card-description">
              Update website settings, college information, and system preferences.
            </p>
            <div className="card-actions">
              <Button variant="admin" size="sm">System Settings</Button>
              <Button variant="admin" size="sm">College Info</Button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <h2 className="section-title">Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">✅</div>
              <div className="activity-content">
                <p className="activity-text">Event "Annual Tech Conference 2024" was published</p>
                <span className="activity-time">2 hours ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">👤</div>
              <div className="activity-content">
                <p className="activity-text">New admin user "John Doe" was added to the system</p>
                <span className="activity-time">1 day ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📝</div>
              <div className="activity-content">
                <p className="activity-text">College information was updated in settings</p>
                <span className="activity-time">3 days ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">🗑️</div>
              <div className="activity-content">
                <p className="activity-text">Event "Spring Workshop" was deleted</p>
                <span className="activity-time">1 week ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
