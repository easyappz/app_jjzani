import React from 'react';
import { Box, Typography } from '@mui/material';
import PhotoStats from '../components/PhotoStats';
import { useParams } from 'react-router-dom';

const StatsPage = () => {
  const { photoId } = useParams();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Статистика фотографии
      </Typography>
      <PhotoStats photoId={photoId} />
    </Box>
  );
};

export default StatsPage;
