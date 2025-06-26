import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/shared/Button';
import './Login.css';

export const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For MVP - just redirect to dashboard without actual authentication
    console.log('Login attempt:', formData);
    alert('Login functionality will be implemented later. Redirecting to dashboard...');
    navigate('/admin/dashboard');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Back to College Website */}
        <div className="back-link">
          <Link to="/" className="back-to-college">
            ← Back to College Website
          </Link>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <div className="login-header">
            <div className="admin-logo">
              <div className="logo-placeholder">
                <span className="logo-text">🔐</span>
              </div>
            </div>
            <h1 className="login-title">Admin Login</h1>
            <p className="login-subtitle">Access the administration dashboard</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" className="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <a href="#forgot" className="forgot-link">Forgot password?</a>
            </div>

            <Button 
              type="submit" 
              variant="admin" 
              size="lg" 
              className="login-button"
            >
              Sign In
            </Button>
          </form>

          <div className="login-footer">
            <p className="demo-note">
              <strong>Demo Credentials:</strong><br />
              Email: admin@excellenceuniversity.edu<br />
              Password: admin123
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="login-info">
          <h3>Need Access?</h3>
          <p>
            Contact the IT department at <strong>it@excellenceuniversity.edu</strong> 
            or call <strong>(555) 123-4567</strong> for account setup or password reset.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
