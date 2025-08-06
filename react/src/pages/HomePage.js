import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 5, textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>
        Добро пожаловать!
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Загружайте свои фотографии, оценивайте работы других пользователей и узнавайте статистику оценок.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/upload')}
        >
          Загрузить фото
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate('/rating')}
        >
          Оценить фото
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
