// src/Components/Navbar.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onSearch, searchValue }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  return (
    <header className="navbar-header bg-white border-bottom sticky-top">
      <div className="container-fluid px-4 py-3">
        <div className="row align-items-center">
          <div className="col-auto">
            <h1 className="mb-0 fs-5 fw-semibold">Momentum</h1>
          </div>
          <div className="col">
            <nav className="d-flex gap-4 justify-content-center">
              <Link 
                to="/dashboard" 
                className={`text-decoration-none nav-link-top ${isActive('/dashboard') ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/notes" 
                className={`text-decoration-none nav-link-top ${isActive('/notes') ? 'active' : ''}`}
              >
                Notes
              </Link>
              <Link 
                to="/tasks" 
                className={`text-decoration-none nav-link-top ${isActive('/tasks') ? 'active' : ''}`}
              >
                Tasks
              </Link>
              <Link 
                to="/habits" 
                className={`text-decoration-none nav-link-top ${isActive('/habits') ? 'active' : ''}`}
              >
                Habits
              </Link>
              <Link 
                to="/analytics" 
                className={`text-decoration-none nav-link-top ${isActive('/analytics') ? 'active' : ''}`}
              >
                Analytics
              </Link>
            </nav>
          </div>
          <div className="col-auto">
            <div className="d-flex align-items-center gap-3">
              {onSearch && (
                <div className="search-box d-flex align-items-center gap-2 px-3 py-2 bg-light rounded border">
                  <i className="bi bi-search text-muted"></i>
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="border-0 bg-transparent"
                    style={{outline: 'none', width: '200px'}}
                    value={searchValue}
                    onChange={(e) => onSearch(e.target.value)}
                  />
                </div>
              )}
              <button className="btn btn-light rounded-circle p-2" style={{width: '40px', height: '40px'}}>
                <i className="bi bi-bell"></i>
              </button>
              <button 
                className="btn btn-light rounded-circle p-2" 
                style={{width: '40px', height: '40px'}}
                onClick={handleSettingsClick}
              >
                <i className="bi bi-gear"></i>
              </button>
              <div className="rounded-circle overflow-hidden" style={{width: '40px', height: '40px'}}>
                <img src="https://via.placeholder.com/40" alt="User" className="w-100 h-100 object-fit-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;