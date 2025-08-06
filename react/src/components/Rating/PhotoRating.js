import React, { useEffect, useState } from 'react';
import { getPhotosForRating, ratePhoto } from '../../api/photoRating';
import { Box, Button, Typography, TextField, MenuItem, Select, FormControl, InputLabel, CircularProgress, Card, CardMedia, CardContent, CardActions } from '@mui/material';

const PhotoRating = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    gender: '',
    minAge: '',
    maxAge: ''
  });

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const data = await getPhotosForRating(filters);
      setPhotos(data.photos || []);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Ошибка загрузки фотографий');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleRate = async (photoId, score) => {
    try {
      await ratePhoto(photoId, score);
      setPhotos((prev) => prev.filter((photo) => photo._id !== photoId));
    } catch (err) {
      setError(err.message || 'Ошибка при оценке');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom align="center">
        Оценка фотографий
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, marginBottom: 3, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 120 }}>
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
            <MenuItem value="other">Другой</MenuItem>
          </Select>
        </FormControl>

        <TextField
          name="minAge"
          label="Минимальный возраст"
          type="number"
          value={filters.minAge}
          onChange={handleFilterChange}
          sx={{ width: 180 }}
        />

        <TextField
          name="maxAge"
          label="Максимальный возраст"
          type="number"
          value={filters.maxAge}
          onChange={handleFilterChange}
          sx={{ width: 180 }}
        />
      </Box>

      {photos.length === 0 ? (
        <Typography variant="h6" align="center">Фотографии не найдены</Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
          {photos.map((photo) => (
            <Card key={photo._id} sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                height="300"
                image={photo.imageData}
                alt="Фотография"
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Пол: {photo.user.gender === 'male' ? 'Мужской' : photo.user.gender === 'female' ? 'Женский' : 'Другой'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Возраст: {photo.user.age}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center' }}>
                {[1, 2, 3, 4, 5].map((score) => (
                  <Button
                    key={score}
                    size="small"
                    variant="outlined"
                    onClick={() => handleRate(photo._id, score)}
                  >
                    {score}
                  </Button>
                ))}
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PhotoRating;
