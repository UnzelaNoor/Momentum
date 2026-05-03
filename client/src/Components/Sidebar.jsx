// src/Components/Sidebar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';


const Sidebar = ({ activePage }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine active page from URL if activePage prop not provided
  const isActive = (path) => {
    if (activePage) {
      return activePage === path;
    }
    return location.pathname === `/${path}` || location.pathname.startsWith(`/${path}`);
  };

  const handleLogout = () => {
      localStorage.removeItem('token')
      navigate('/login')
  }

  return (
    <div className="sidebar bg-light-purple">
      <div className="sidebar-header mb-4">
        <div className="d-flex align-items-center gap-3">
          <div className="logo-icon">M</div>
          <div>
            <h2 className="mb-0 fs-6 fw-semibold">Momentum</h2>
            <p className="mb-0 text-uppercase small text-muted">Digital Sanctuary</p>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav flex-grow-1">
        <Link 
          to="/dashboard" 
          className={`nav-item d-flex align-items-center gap-3 p-3 rounded text-decoration-none mb-2 ${isActive('dashboard') ? 'active' : ''}`}
        >
          <i className="bi bi-grid fs-5"></i>
          <span>Home</span>
        </Link>
        <Link 
          to="/notes" 
          className={`nav-item d-flex align-items-center gap-3 p-3 rounded text-decoration-none mb-2 ${isActive('notes') ? 'active' : ''}`}
        >
          <i className="bi bi-journal-text fs-5"></i>
          <span>Library</span>
        </Link>
        <Link 
          to="/tasks" 
          className={`nav-item d-flex align-items-center gap-3 p-3 rounded text-decoration-none mb-2 ${isActive('tasks') ? 'active' : ''}`}
        >
          <i className="bi bi-check-square fs-5"></i>
          <span>Checklist</span>
        </Link>
        <Link 
          to="/habits" 
          className={`nav-item d-flex align-items-center gap-3 p-3 rounded text-decoration-none mb-2 ${isActive('habits') ? 'active' : ''}`}
        >
          <i className="bi bi-lightning fs-5"></i>
          <span>Streaks</span>
        </Link>
        <Link 
          to="/analytics" 
          className={`nav-item d-flex align-items-center gap-3 p-3 rounded text-decoration-none mb-2 ${isActive('analytics') ? 'active' : ''}`}
        >
          <i className="bi bi-graph-up fs-5"></i>
          <span>Insights</span>
        </Link>
      </nav>

      <div className="sidebar-footer mt-auto pt-3 border-top">
        <a href="/help" className="nav-item d-flex align-items-center gap-3 p-3 rounded text-decoration-none mb-2">
          <i className="bi bi-question-circle fs-5"></i>
          <span>Help</span>
        </a>
        {/* <a href="/logout" className="nav-item d-flex align-items-center gap-3 p-3 rounded text-decoration-none">
          <i className="bi bi-box-arrow-right fs-5"></i>
          <span>Logout</span>
        </a> */}
        <button onClick={handleLogout} className="nav-item d-flex align-items-center gap-3 p-3 rounded text-decoration-none border-0 bg-transparent w-100">
            <i className="bi bi-box-arrow-right fs-5"></i>
            <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;