import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/user-dashboard')}>
        Excel Visualizer
      </div>
      <div className="navbar-links">
        <button
          className={isActive('/user-dashboard') ? 'navbar-link active' : 'navbar-link'}
          onClick={() => navigate('/user-dashboard')}
        >
          Dashboard
        </button>
        <button
          className={isActive('/upload-excel') ? 'navbar-link active' : 'navbar-link'}
          onClick={() => navigate('/upload-excel')}
        >
          Upload Excel
        </button>
      </div>
      <div className="navbar-actions">
        <button className="navbar-logout" onClick={() => {
          localStorage.removeItem('user');
          navigate('/login');
        }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 