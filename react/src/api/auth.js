import instance from './axios';

// Register a new user
export const register = async (data) => {
  const response = await instance.post('/register', data);
  return response.data;
};

// Login user
export const login = async (data) => {
  const response = await instance.post('/login', data);
  return response.data;
};

// Request password reset
export const forgotPassword = async (email) => {
  const response = await instance.post('/forgot-password', { email });
  return response.data;
};

// Reset password
export const resetPassword = async (resetToken, newPassword) => {
  const response = await instance.post('/reset-password', { resetToken, newPassword });
  return response.data;
};
