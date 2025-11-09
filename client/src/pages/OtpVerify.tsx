import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // optional, you can rename or reuse your Register.css

const OtpVerify: React.FC = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const email = localStorage.getItem('pendingEmail'); // ✅ from Register.tsx

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      toast.error('Please enter the OTP.');
      return;
    }

    if (!email) {
      toast.error('Email not found. Please register again.');
      navigate('/register');
      return;
    }

    try {
      // ✅ Send email + OTP to backend
      const response = await axios.post('http://127.0.0.1:8000/api/auth/verify-otp/', {
        email,
        otp,
      });

      // ✅ Save auth token for authenticated routes
      localStorage.setItem('authToken', response.data.token);

      toast.success('✅ OTP verified successfully!');
      navigate('/dashboard'); // redirect to your protected page
    } catch (error: any) {
      console.error('Verify error:', error.response?.data || error.message);
      const msg =
        error.response?.data?.error || '❌ Invalid or expired OTP. Please try again.';
      toast.error(msg);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-gradient-custom p-4">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: '450px' }}>
        <h2 className="text-center mb-4 fw-bold">Enter OTP</h2>
        <form onSubmit={handleVerify}>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="form-control text-center"
              maxLength={6}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100 fw-semibold">
            Verify OTP
          </button>
        </form>

        {/* Display the email below for clarity */}
        {email && (
          <p className="text-center mt-3 small text-muted">
            Sent to <b>{email}</b>
          </p>
        )}
      </div>
    </div>
  );
};

export default OtpVerify;
