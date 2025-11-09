import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
    password1: '',
    password2: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (!formData.username || !formData.full_name || !formData.email || !formData.password1 || !formData.password2) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (formData.password1 !== formData.password2) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/auth/register/', formData);
      toast.success('✅ OTP sent to your email. Please verify.');
      localStorage.setItem('pendingEmail', formData.email);
      navigate('/verify-otp');
    } catch (err: any) {
      console.error('Registration error:', err);
      const errorMsg =
        err.response?.data?.error || '❌ Registration failed. Please check your details.';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-gradient-custom p-4">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: '450px' }}>
        <h2 className="text-center mb-4 fw-bold">Create an Account</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-3">
            <input
              name="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <input
              name="full_name"
              type="text"
              placeholder="Full Name"
              value={formData.full_name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <input
              name="password1"
              type="password"
              placeholder="Password"
              value={formData.password1}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-4">
            <input
              name="password2"
              type="password"
              placeholder="Confirm Password"
              value={formData.password2}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-semibold">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
