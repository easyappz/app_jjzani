import instance from './axios';

// Upload a photo
export const uploadPhoto = async (imageData) => {
  const response = await instance.post('/photos/upload', { imageData });
  return response.data;
};

// Add photo to rating list
export const addPhotoToRating = async (photoId) => {
  const response = await instance.post('/photos/add-to-rating', { photoId });
  return response.data;
};

// Remove photo from rating list
export const removePhotoFromRating = async (photoId) => {
  const response = await instance.post('/photos/remove-from-rating', { photoId });
  return response.data;
};

// Get photos for rating with filters
export const getPhotosForRating = async (filters = {}) => {
  const { gender, minAge, maxAge } = filters;
  const params = {};
  if (gender) params.gender = gender;
  if (minAge) params.minAge = minAge;
  if (maxAge) params.maxAge = maxAge;

  const response = await instance.get('/photos/for-rating', { params });
  return response.data;
};

// Rate a photo
export const ratePhoto = async (photoId, score) => {
  const response = await instance.post('/photos/rate', { photoId, score });
  return response.data;
};

// Get rating statistics for a photo
export const getPhotoStats = async (photoId) => {
  const response = await instance.get(`/photos/${photoId}/stats`);
  return response.data;
};
