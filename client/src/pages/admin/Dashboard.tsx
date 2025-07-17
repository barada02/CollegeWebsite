import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/shared/Button';
import { DashboardService, type DashboardStats } from '../../services/dashboardApi';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [dashboardStats, activityData] = await Promise.all([
          DashboardService.getDashboardStats(),
          DashboardService.getRecentActivity()
        ]);
        setStats(dashboardStats);
        setRecentActivity(activityData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="loading-state">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="error-state">
            <p>{error || 'Failed to load dashboard data'}</p>
            <Button variant="admin" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Dashboard Overview</h1>
            <p className="dashboard-subtitle">Welcome back! Here's what's happening at Excellence University.</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">@</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalContacts}</div>
              <div className="stat-label">Total Contact Inquiries</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">★</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalEvents}</div>
              <div className="stat-label">Total Events</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">♦</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalFaculty}</div>
              <div className="stat-label">Faculty Members</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">NEW</div>
            <div className="stat-content">
              <div className="stat-number">{stats.contactsByStatus.new}</div>
              <div className="stat-label">New Contact Leads</div>
            </div>
          </div>
        </div>

        {/* Management Cards */}
        <div className="management-grid">
          <div className="management-card">
            <div className="card-header">
              <h3 className="card-title">🎯 Student Leads</h3>
              <span className="card-badge">{stats.totalContacts} Total</span>
            </div>
            <p className="card-description">
              Manage student inquiries and contact submissions. Track responses and follow-ups.
            </p>
            <div className="card-stats">
              <div className="mini-stat">
                <span className="mini-stat-number">{stats.contactsByStatus.new}</span>
                <span className="mini-stat-label">New</span>
              </div>
              <div className="mini-stat">
                <span className="mini-stat-number">{stats.contactsByStatus.replied}</span>
                <span className="mini-stat-label">Replied</span>
              </div>
            </div>
            <div className="card-actions">
              <Link to="/admin/leads">
                <Button variant="admin" size="sm">Manage Leads</Button>
              </Link>
            </div>
          </div>

          <div className="management-card">
            <div className="card-header">
              <h3 className="card-title">� Events Management</h3>
              <span className="card-badge">{stats.totalEvents} Events</span>
            </div>
            <p className="card-description">
              Create, edit, and manage all college events. Add event details, dates, and locations.
            </p>
            {stats.recentEvents.length > 0 && (
              <div className="recent-items">
                <h4>Recent Events:</h4>
                {stats.recentEvents.slice(0, 2).map(event => (
                  <div key={event.id} className="recent-item">
                    <span className="recent-title">{event.title}</span>
                    <span className="recent-date">{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="card-actions">
              <Link to="/admin/events">
                <Button variant="admin" size="sm">Manage Events</Button>
              </Link>
            </div>
          </div>

          <div className="management-card">
            <div className="card-header">
              <h3 className="card-title">�‍🏫 Faculty Management</h3>
              <span className="card-badge">{stats.totalFaculty} Members</span>
            </div>
            <p className="card-description">
              Manage faculty profiles, qualifications, and contact information.
            </p>
            <div className="card-actions">
              <Link to="/admin/faculty">
                <Button variant="admin" size="sm">Manage Faculty</Button>
              </Link>
            </div>
          </div>

          <div className="management-card">
            <div className="card-header">
              <h3 className="card-title">📝 About Management</h3>
              <span className="card-badge">Content</span>
            </div>
            <p className="card-description">
              Update college information, mission, vision, and about page content.
            </p>
            <div className="card-actions">
              <Link to="/admin/about">
                <Button variant="admin" size="sm">Manage Content</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <h2 className="section-title">Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">{activity.icon}</div>
                  <div className="activity-content">
                    <p className="activity-text">{activity.description}</p>
                    <span className="activity-time">{formatTimeAgo(activity.timestamp)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="activity-item">
                <div className="activity-icon">�</div>
                <div className="activity-content">
                  <p className="activity-text">No recent activity</p>
                  <span className="activity-time">Start managing your content to see activity here</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
