import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // ✅ Post username + password (no email)
      console.log("📤 Sending login payload:", {
  username: credentials.username,
  password: credentials.password,
});

      const res = await axios.post(
  'http://127.0.0.1:8000/api/auth/login/',
  {
    username: credentials.username,
    password: credentials.password,
  },
  {
    headers: {
      'Content-Type': 'application/json',
    },
  }
);


      const token = res.data.token;
      localStorage.setItem('authToken', token); // store auth token
      localStorage.setItem('username', res.data.username); // optional, for navbar display

      toast.success('✅ Login successful!');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        '❌ Invalid username or password';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-gradient-custom p-4">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4 fw-bold">Login 👤</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              name="username"
              type="text"
              placeholder="Username"
              value={credentials.username}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-4">
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-semibold">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
