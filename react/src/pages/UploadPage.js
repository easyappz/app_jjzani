import React from 'react';
import { Box, Typography } from '@mui/material';
import PhotoUpload from '../components/PhotoUpload';

const UploadPage = () => {
  const handleUploadSuccess = () => {
    // Optionally refresh user's photo list or show a success message
    console.log('Photo uploaded successfully');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Загрузка фотографии
      </Typography>
      <PhotoUpload onUploadSuccess={handleUploadSuccess} />
    </Box>
  );
};

export default UploadPage;
