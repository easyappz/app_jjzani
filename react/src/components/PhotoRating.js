import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Slider, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { getPhotosForRating, ratePhoto } from '../api/photo';

const PhotoRating = () => {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(5);
  const [success, setSuccess] = useState(false);
  const [filters, setFilters] = useState({
    gender: '',
    minAge: '',
    maxAge: ''
  });

  const loadNextPhoto = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const data = await getPhotosForRating(filters);
      if (data.photos && data.photos.length > 0) {
        setPhoto(data.photos[0]);
      } else {
        setPhoto(null);
        setError('Фотографии для оценки не найдены. Попробуйте изменить фильтры.');
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Ошибка при загрузке фотографии. Попробуйте снова.');
      console.error(err);
    }
  };

  useEffect(() => {
    loadNextPhoto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleRate = async () => {
    if (!photo) return;

    setLoading(true);
    setError(null);

    try {
      await ratePhoto(photo._id, score);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        loadNextPhoto();
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError('Ошибка при оценке фотографии. Попробуйте снова.');
      console.error(err);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Оценить фотографию
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3 }}>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Пол</InputLabel>
          <Select
            name="gender"
            value={filters.gender}
            onChange={handleFilterChange}
            label="Пол"
          >
            <MenuItem value="">Все</MenuItem>
            <MenuItem value="male">Мужской</MenuItem>
            <MenuItem value="female">Женский</MenuItem>
            <MenuItem value="other">Другое</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Возраст от</InputLabel>
          <Select
            name="minAge"
            value={filters.minAge}
            onChange={handleFilterChange}
            label="Возраст от"
          >
            <MenuItem value="">Не важно</MenuItem>
            <MenuItem value={18}>18</MenuItem>
            <MenuItem value={26}>26</MenuItem>
            <MenuItem value={36}>36</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Возраст до</InputLabel>
          <Select
            name="maxAge"
            value={filters.maxAge}
            onChange={handleFilterChange}
            label="Возраст до"
          >
            <MenuItem value="">Не важно</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={35}>35</MenuItem>
            <MenuItem value={100}>36+</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {photo ? (
            <Box sx={{ mb: 3 }}>
              <img
                src={photo.imageData}
                alt="Фотография для оценки"
                style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain', borderRadius: 8 }}
              />
              <Box sx={{ mt: 2, px: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Ваша оценка
                </Typography>
                <Slider
                  value={score}
                  onChange={(_, newValue) => setScore(newValue)}
                  min={1}
                  max={10}
                  valueLabelDisplay="auto"
                  sx={{ width: '100%' }}
                />
              </Box>
              <Button
                variant="contained"
                color="primary"
                onClick={handleRate}
                disabled={loading}
                sx={{ mt: 2 }}
              >
                Оценить
              </Button>
            </Box>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ my: 4 }}>
              Фотографии для оценки отсутствуют.
            </Typography>
          )}
        </>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Оценка успешно сохранена!
        </Alert>
      )}
    </Box>
  );
};

export default PhotoRating;
