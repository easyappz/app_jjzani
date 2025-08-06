import instance from './axios';

// Get user profile
export const getProfile = async () => {
  const response = await instance.get('/profile');
  return response.data;
};

// Update user profile
export const updateProfile = async (data) => {
  const response = await instance.put('/profile', data);
  return response.data;
};
