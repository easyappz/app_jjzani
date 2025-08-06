import React from 'react';
import { Box, Typography } from '@mui/material';
import PhotoRating from '../components/PhotoRating';

const RatingPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Оценка фотографий
      </Typography>
      <PhotoRating />
    </Box>
  );
};

export default RatingPage;
