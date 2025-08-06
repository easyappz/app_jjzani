import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from './api/user';
import Home from './pages/Home';
import PhotoStats from './components/Stats/PhotoStats';
import PhotoRating from './components/Rating/PhotoRating';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import UploadPage from './pages/UploadPage';
import RatingPage from './pages/RatingPage';
import StatsPage from './pages/StatsPage';
import ManagePage from './pages/ManagePage';
import Profile from './pages/user/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const { data: profileData, isLoading, isError } = useQuery(
    ['profile'],
    getProfile,
    {
      enabled: isAuthenticated,
      retry: false,
      onError: () => {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  );

  useEffect(() => {
    if (isAuthenticated && !isLoading && !isError && profileData) {
      navigate('/rating');
    } else if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, isError, profileData, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/upload" element={
        <ProtectedRoute>
          <UploadPage />
        </ProtectedRoute>
      } />
      <Route path="/rating" element={
        <ProtectedRoute>
          <RatingPage />
        </ProtectedRoute>
      } />
      <Route path="/stats" element={
        <ProtectedRoute>
          <StatsPage />
        </ProtectedRoute>
      } />
      <Route path="/stats/:photoId" element={
        <ProtectedRoute>
          <PhotoStats />
        </ProtectedRoute>
      } />
      <Route path="/manage" element={
        <ProtectedRoute>
          <ManagePage />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
