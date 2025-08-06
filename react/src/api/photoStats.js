import instance from './axios';

export const getPhotoStats = async (photoId) => {
  try {
    const response = await instance.get(`/photos/${photoId}/stats`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching photo stats' };
  }
};
