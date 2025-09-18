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
      const res = await axios.post('http://127.0.0.1:8000/api/login/', credentials); // 🔄 Updated endpoint
      const token = res.data.token; // 🔄 Changed from 'key' to 'token'

      localStorage.setItem('token', token); // ✅ Store token

      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err: any) {
      const errorMsg = err.response?.data?.non_field_errors?.[0] || err.response?.data?.detail || 'Login failed';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="card p-4 mx-auto" style={{ maxWidth: '400px' }}>
      <h2 className="mb-3">Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" className="form-control mb-2" placeholder="Username" onChange={handleChange} />
        <input name="password" type="password" className="form-control mb-3" placeholder="Password" onChange={handleChange} />
        <button className="btn btn-success w-100" type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
