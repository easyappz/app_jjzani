import React, { useState, useRef } from 'react';
import { Box, Typography, Button, TextField, CircularProgress, Alert, Snackbar, Grid, Card, CardMedia, CardActions } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadPhoto, addPhotoToRating, removePhotoFromRating } from '../../api/photos';
import { getProfile } from '../../api/user';

const Upload = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { data: profileData, isLoading: profileLoading, isError: profileError } = useQuery(
    ['profile'],
    getProfile
  );

  const uploadMutation = useMutation({
    mutationFn: uploadPhoto,
    onSuccess: () => {
      setSuccess('Фотография успешно загружена');
      setFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      queryClient.invalidateQueries(['profile']);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Ошибка загрузки фотографии');
    },
  });

  const addToRatingMutation = useMutation({
    mutationFn: addPhotoToRating,
    onSuccess: () => {
      setSuccess('Фотография добавлена в список для оценки');
      queryClient.invalidateQueries(['profile']);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Ошибка добавления фотографии в список');
    },
  });

  const removeFromRatingMutation = useMutation({
    mutationFn: removePhotoFromRating,
    onSuccess: () => {
      setSuccess('Фотография удалена из списка для оценки');
      queryClient.invalidateQueries(['profile']);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Ошибка удаления фотографии из списка');
    },
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(selectedFile);
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = () => {
    if (!file) {
      setError('Пожалуйста, выберите файл');
      return;
    }
    uploadMutation.mutate(preview);
  };

  const handleAddToRating = (photoId) => {
    addToRatingMutation.mutate(photoId);
  };

  const handleRemoveFromRating = (photoId) => {
    removeFromRatingMutation.mutate(photoId);
  };

  if (profileLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (profileError) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography color="error">Ошибка загрузки данных профиля</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Загрузка фотографий
      </Typography>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

      <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2, boxShadow: 1, mb: 5 }}>
        <Typography variant="h6" gutterBottom>
          Текущие баллы: {profileData?.user?.points || 0}
        </Typography>
        <TextField
          type="file"
          inputRef={fileInputRef}
          onChange={handleFileChange}
          fullWidth
          margin="normal"
          InputProps={{
            inputProps: {
              accept: 'image/*',
            },
          }}
        />
        {preview && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px' }} />
          </Box>
        )}
        <Button
          onClick={handleUpload}
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          disabled={uploadMutation.isLoading}
        >
          {uploadMutation.isLoading ? 'Загрузка...' : 'Загрузить фотографию'}
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom>
        Ваши фотографии
      </Typography>
      {profileData?.user?.photos?.length > 0 ? (
        <Grid container spacing={3}>
          {profileData.user.photos.map((photo) => (
            <Grid item xs={12} sm={6} md={4} key={photo._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={photo.imageData}
                  alt="Фото"
                />
                <CardActions>
                  {photo.isInRating ? (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleRemoveFromRating(photo._id)}
                      disabled={removeFromRatingMutation.isLoading}
                    >
                      Удалить из оценки
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleAddToRating(photo._id)}
                      disabled={addToRatingMutation.isLoading || profileData.user.points <= 0}
                    >
                      Добавить в оценку
                    </Button>
                  )}
                  <Button
                    size="small"
                    onClick={() => {
                      // Placeholder for stats navigation if needed
                      alert('Статистика скоро будет доступна');
                    }}
                  >
                    Статистика
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>У вас пока нет загруженных фотографий.</Typography>
      )}
    </Box>
  );
};

export default Upload;
