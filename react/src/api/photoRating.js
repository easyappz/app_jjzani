import instance from './axios';

export const getPhotosForRating = async (filters = {}) => {
  try {
    const response = await instance.get('/photos/for-rating', {
      params: filters
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching photos for rating' };
  }
};

export const ratePhoto = async (photoId, score) => {
  try {
    const response = await instance.post('/photos/rate', { photoId, score });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error rating photo' };
  }
};
