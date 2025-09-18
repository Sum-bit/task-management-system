import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // You can define any custom CSS here if needed
export {}

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      await axios.post('http://127.0.0.1:8000/api/auth/register/', formData);
      toast.success('✅ Registration successful! Please check your email.');
      navigate('/verify-otp');
    } catch (error: any) {
      console.error("Registration error:", error);
      const errors = error.response?.data;
  
      if (errors && typeof errors === 'object') {
        Object.entries(errors).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((msg) => {
              toast.error(`${key}: ${msg}`);
            });
          } else if (typeof value === 'string') {
            toast.error(`${key}: ${value}`);
          } else {
            toast.error(`${key}: ${JSON.stringify(value)}`);
          }
        });
      } else {
        toast.error('❌ Registration failed. Please try again.');
      }
  
      // Clear the form
      setFormData({
        username: '',
        email: '',
        password1: '',
        password2: '',
      });
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
