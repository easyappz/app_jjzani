import instance from './axios';

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await instance.post('/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Login a user
export const loginUser = async (credentials) => {
  try {
    const response = await instance.post('/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Request password reset
export const forgotPassword = async (email) => {
  try {
    const response = await instance.post('/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Reset password
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await instance.post('/reset-password', { token, newPassword });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get user profile
export const getProfile = async () => {
  try {
    const response = await instance.get('/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update user profile
export const updateProfile = async (profileData) => {
  try {
    const response = await instance.put('/profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Logout user (client-side only, removes token)
export const logoutUser = () => {
  localStorage.removeItem('token');
};
