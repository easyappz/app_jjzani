import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Profile from './pages/user/Profile';
import Upload from './pages/photos/Upload';
import Rating from './pages/photos/Rating';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    success: {
      main: '#2e7d32',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/register" element={<Layout><Register /></Layout>} />
            <Route path="/login" element={<Layout><Login /></Layout>} />
            <Route path="/forgot-password" element={<Layout><ForgotPassword /></Layout>} />
            <Route path="/reset-password/:token" element={<Layout><ResetPassword /></Layout>} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout><Profile /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <Layout><Upload /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/rating"
              element={
                <ProtectedRoute>
                  <Layout><Rating /></Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
