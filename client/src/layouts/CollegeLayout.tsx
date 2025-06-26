import React from 'react';
import { Outlet } from 'react-router-dom';
import CollegeHeader from '../components/college/Header';
import CollegeFooter from '../components/college/Footer';
import './CollegeLayout.css';

export const CollegeLayout: React.FC = () => {
  return (
    <div className="college-layout">
      <CollegeHeader />
      <main className="main-content">
        <Outlet />
      </main>
      <CollegeFooter />
    </div>
  );
};

export default CollegeLayout;
