import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CreateTask from './pages/CreateTask';
import Login from './pages/Login';
import Register from './pages/Register';
import Welcome from './pages/Welcome';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './componets/Navbar';
import OtpVerify from './pages/OtpVerify';

const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  const location = useLocation();

  // Routes where the Navbar should be hidden
  const hideNavOn = ['/', '/login', '/register', '/verify-otp'];

  return (
    <div className="container mt-4">
      {/* Show Navbar only if logged in and not on public routes */}
      {isAuthenticated && !hideNavOn.includes(location.pathname) && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<OtpVerify />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/create"
          element={isAuthenticated ? <CreateTask /> : <Navigate to="/login" />}
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default App;
