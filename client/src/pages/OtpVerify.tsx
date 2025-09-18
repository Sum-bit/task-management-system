import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { email, password } = location.state || {};

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/verify-otp/', {
        email,
        otp,
        password,
      });
      localStorage.setItem('authToken', response.data.token);
      toast.success('OTP verified successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('OTP verification failed.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Verify OTP</h2>
      <form onSubmit={handleVerify}>
        <div className="mb-3">
          <label>OTP</label>
          <input type="text" value={otp} className="form-control" onChange={(e) => setOtp(e.target.value)} required />
        </div>
        <button className="btn btn-primary w-100" type="submit">Verify OTP</button>
      </form>
    </div>
  );
};

export default OTPVerification;
