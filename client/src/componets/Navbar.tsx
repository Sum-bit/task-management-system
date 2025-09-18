import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { logoutUser } from '../utils/auth';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser(navigate);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-2 shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/dashboard">
          <span role="img" aria-label="logo" className="me-2">📒</span>
          <strong>Task Manager</strong>
        </Link>
        <div className="d-flex align-items-center gap-3 ms-auto">
          <Link to="/dashboard" className="nav-link text-light d-flex align-items-center">
            <span role="img" aria-label="dashboard" className="me-1">📊</span> Dashboard
          </Link>
          <Link to="/create-task" className="nav-link text-light d-flex align-items-center">
            <span role="img" aria-label="create" className="me-1">➕</span> Create Task
          </Link>
          <button className="btn btn-outline-warning btn-sm d-flex align-items-center" onClick={handleLogout}>
            <span role="img" aria-label="logout" className="me-1">🔒</span> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
