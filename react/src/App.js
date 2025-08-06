import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import RatingPage from './pages/RatingPage';
import ManagePage from './pages/ManagePage';
import StatsPage from './pages/StatsPage';

function App() {
  return (
    <Router>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/rating" element={<RatingPage />} />
          <Route path="/manage" element={<ManagePage />} />
          <Route path="/stats/:photoId" element={<StatsPage />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
