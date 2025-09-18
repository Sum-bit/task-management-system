import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-gradient">
      <div className="bg-white rounded p-5 shadow text-center" style={{ maxWidth: '600px', width: '100%' }}>
        <h1 className="mb-3 fw-bold">Welcome <span role="img" aria-label="wave">👋</span></h1>
        <p className="text-muted mb-4">Get started by logging in or signing up!</p>

        <div className="d-flex justify-content-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="btn btn-primary"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="btn btn-secondary"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
