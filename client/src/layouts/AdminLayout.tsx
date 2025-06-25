import React from 'react';
import { Outlet } from 'react-router-dom';
// Admin layout components
import AdminSidebar from '../components/admin/AdminSidebar.tsx';
import AdminHeader from '../components/admin/AdminHeader.tsx';
import './AdminLayout.css';

export const AdminLayout: React.FC = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
