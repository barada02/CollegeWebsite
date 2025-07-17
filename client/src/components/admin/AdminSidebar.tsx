import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminSidebar.css';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/about', label: 'About Management', icon: '📝' },
    { path: '/admin/contacts', label: 'Contact Messages', icon: '📬' },
    { path: '/admin/leads', label: 'Student Leads', icon: '🎯' },
    { path: '/admin/events', label: 'Events', icon: '📅' },
    { path: '/admin/faculty', label: 'Faculty', icon: '👨‍🏫' },
    { path: '/admin/students', label: 'Students', icon: '👥' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <Link to="/" className="logo-link">
          <div className="admin-logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">Admin Panel</span>
          </div>
        </Link>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <Link to="/" className="back-to-site">
          <span className="nav-icon">🌐</span>
          <span className="nav-label">View College Site</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
