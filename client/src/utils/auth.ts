// src/utils/auth.ts
import { toast } from 'react-toastify';

export const getAuthToken = (): string | null => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    toast.error('⚠️ No auth token found. Please log in again.');
  }
  return token;
};

export const logoutUser = (navigate: (path: string) => void) => {
  localStorage.removeItem('authToken');
  toast.info('👋 Logged out successfully.');
  navigate('/login');
};
