import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import { addPhotoToRating, removePhotoFromRating } from '../api/photo';

// Mock function to simulate fetching user's photos
const fetchUserPhotos = async () => {
  // This should be replaced with an actual API call to fetch user's photos
  return [
    { _id: 'mock1', imageData: 'https://via.placeholder.com/150', inRating: false },
    { _id: 'mock2', imageData: 'https://via.placeholder.com/150', inRating: true },
  ];
};

const PhotoManagement = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  const loadPhotos = async () => {
    setLoading(true);
    setError(null);

    try {
      const userPhotos = await fetchUserPhotos();
      setPhotos(userPhotos);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Ошибка при загрузке ваших фотографий. Попробуйте снова.');
      console.error(err);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const handleAddToRating = async (photoId) => {
    setActionLoading((prev) => ({ ...prev, [photoId]: true }));
    try {
      await addPhotoToRating(photoId);
      setPhotos((prev) =>
        prev.map((photo) =>
          photo._id === photoId ? { ...photo, inRating: true } : photo
        )
      );
    } catch (err) {
      console.error(err);
      alert('Ошибка при добавлении фотографии в рейтинг.');
    } finally {
      setActionLoading((prev) => ({ ...prev, [photoId]: false }));
    }
  };

  const handleRemoveFromRating = async (photoId) => {
    setActionLoading((prev) => ({ ...prev, [photoId]: true }));
    try {
      await removePhotoFromRating(photoId);
      setPhotos((prev) =>
        prev.map((photo) =>
          photo._id === photoId ? { ...photo, inRating: false } : photo
        )
      );
    } catch (err) {
      console.error(err);
      alert('Ошибка при удалении фотографии из рейтинга.');
    } finally {
      setActionLoading((prev) => ({ ...prev, [photoId]: false }));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom align="center">
        Управление фотографиями
      </Typography>

      {photos.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', my: 4 }}>
          У вас пока нет загруженных фотографий.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
          {photos.map((photo) => (
            <Box
              key={photo._id}
              sx={{
                width: 200,
                border: '1px solid #ddd',
                borderRadius: 2,
                p: 2,
                textAlign: 'center',
              }}
            >
              <img
                src={photo.imageData}
                alt="Ваша фотография"
                style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 4, marginBottom: 8 }}
              />
              {photo.inRating ? (
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  disabled={actionLoading[photo._id]}
                  onClick={() => handleRemoveFromRating(photo._id)}
                  sx={{ width: '100%' }}
                >
                  {actionLoading[photo._id] ? <CircularProgress size={20} /> : 'Удалить из рейтинга'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  disabled={actionLoading[photo._id]}
                  onClick={() => handleAddToRating(photo._id)}
                  sx={{ width: '100%' }}
                >
                  {actionLoading[photo._id] ? <CircularProgress size={20} /> : 'Добавить в рейтинг'}
                </Button>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PhotoManagement;
