import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../shared/Button';
import './AdminHeader.css';

export const AdminHeader: React.FC = () => {
  return (
    <header className="admin-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="page-title">Aurora University Admin</h1>
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <span className="user-avatar">👤</span>
            <div className="user-details">
              <span className="user-name">Admin User</span>
              <span className="user-role">Administrator</span>
            </div>
          </div>
          
          <div className="header-actions">
            <Link to="/admin/login">
              <Button variant="admin" size="sm">Logout</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
