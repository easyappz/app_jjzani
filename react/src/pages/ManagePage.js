import React from 'react';
import { Box, Typography } from '@mui/material';
import PhotoManagement from '../components/PhotoManagement';

const ManagePage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Управление фотографиями
      </Typography>
      <PhotoManagement />
    </Box>
  );
};

export default ManagePage;
