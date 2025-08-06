import React, { useState } from 'react';
import { Box, Typography, Button, MenuItem, Select, InputLabel, FormControl, TextField, Slider, CircularProgress, Alert, Snackbar } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPhotosForRating, ratePhoto } from '../../api/photos';
import { getProfile } from '../../api/user';

const Rating = () => {
  const queryClient = useQueryClient();
  const [gender, setGender] = useState('');
  const [ageRange, setAgeRange] = useState([18, 50]);
  const [rating, setRating] = useState(5);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { data: profileData, isLoading: profileLoading, isError: profileError } = useQuery(
    ['profile'],
    getProfile
  );

  const { data: photosData, isLoading: photosLoading, isError: photosError, refetch } = useQuery(
    ['photosForRating', gender, ageRange],
    () => getPhotosForRating({ gender, minAge: ageRange[0], maxAge: ageRange[1] }),
    {
      enabled: filtersApplied,
      refetchOnWindowFocus: false,
    }
  );

  const rateMutation = useMutation({
    mutationFn: ratePhoto,
    onSuccess: () => {
      setSuccess('Оценка сохранена. Вы получили 1 балл.');
      queryClient.invalidateQueries(['profile']);
      refetch();
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Ошибка при оценке фотографии');
    },
  });

  const handleApplyFilters = () => {
    setFiltersApplied(true);
    refetch();
  };

  const handleRatePhoto = (photoId) => {
    rateMutation.mutate(photoId, rating);
  };

  if (profileLoading || photosLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (profileError || photosError) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography color="error">Ошибка загрузки данных</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Оценка фотографий
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

      <Typography variant="h6" gutterBottom>
        Текущие баллы: {profileData?.user?.points || 0}
      </Typography>

      <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2, boxShadow: 1, mb: 5 }}>
        <Typography variant="subtitle1" gutterBottom>
          Фильтры для поиска фотографий:
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>Пол</InputLabel>
          <Select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            label="Пол"
          >
            <MenuItem value="">Любой</MenuItem>
            <MenuItem value="male">Мужской</MenuItem>
            <MenuItem value="female">Женский</MenuItem>
            <MenuItem value="other">Другое</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ mt: 2 }}>
          <Typography gutterBottom>Возрастной диапазон: {ageRange[0]} - {ageRange[1]}</Typography>
          <Slider
            value={ageRange}
            onChange={(_, newValue) => setAgeRange(newValue)}
            min={18}
            max={100}
            valueLabelDisplay="auto"
          />
        </Box>
        <Button
          onClick={handleApplyFilters}
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
        >
          Применить фильтры
        </Button>
      </Box>

      {photosData?.photos?.length > 0 ? (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Фотография для оценки
          </Typography>
          <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2, boxShadow: 1, mb: 3 }}>
            <img
              src={photosData.photos[0].imageData}
              alt="Фото для оценки"
              style={{ maxWidth: '100%', maxHeight: '400px', marginBottom: '16px' }}
            />
            <Typography>Пол: {photosData.photos[0].user.gender === 'male' ? 'Мужской' : photosData.photos[0].user.gender === 'female' ? 'Женский' : 'Другое'}</Typography>
            <Typography>Возраст: {photosData.photos[0].user.age}</Typography>
            <Box sx={{ mt: 2 }}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Оценка</InputLabel>
                <Select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  label="Оценка"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Button
              onClick={() => handleRatePhoto(photosData.photos[0]._id)}
              variant="contained"
              sx={{ mt: 2 }}
              disabled={rateMutation.isLoading}
            >
              {rateMutation.isLoading ? 'Оцениваем...' : 'Оценить'}
            </Button>
          </Box>
        </Box>
      ) : (
        <Typography align="center">Фотографии для оценки не найдены. Попробуйте изменить фильтры.</Typography>
      )}
    </Box>
  );
};

export default Rating;
