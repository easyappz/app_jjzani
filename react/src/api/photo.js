import instance from './axios';

// Upload a photo
export const uploadPhoto = async (imageData) => {
  try {
    const response = await instance.post('/photos/upload', { imageData });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Add photo to rating list
export const addPhotoToRating = async (photoId) => {
  try {
    const response = await instance.post('/photos/add-to-rating', { photoId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Remove photo from rating list
export const removePhotoFromRating = async (photoId) => {
  try {
    const response = await instance.post('/photos/remove-from-rating', { photoId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get photos for rating with filters
export const getPhotosForRating = async (filters = {}) => {
  try {
    const { gender, minAge, maxAge } = filters;
    const params = {};
    if (gender) params.gender = gender;
    if (minAge) params.minAge = minAge;
    if (maxAge) params.maxAge = maxAge;
    
    const response = await instance.get('/photos/for-rating', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Rate a photo
export const ratePhoto = async (photoId, score) => {
  try {
    const response = await instance.post('/photos/rate', { photoId, score });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get photo rating statistics
export const getPhotoStats = async (photoId) => {
  try {
    const response = await instance.get(`/photos/${photoId}/stats`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
