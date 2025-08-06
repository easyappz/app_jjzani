import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../../api/auth';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      navigate(from, { replace: true });
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Ошибка входа');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Все поля обязательны для заполнения');
      return;
    }
    mutation.mutate({ email, password });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Вход
      </Typography>

      {error && (
        <Typography color="error" align="center" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <TextField
        fullWidth
        margin="normal"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Пароль"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        sx={{ mt: 3, mb: 2 }}
        disabled={mutation.isLoading}
      >
        {mutation.isLoading ? 'Вход...' : 'Войти'}
      </Button>
      <Typography align="center">
        <Button variant="text" onClick={() => navigate('/forgot-password')}>
          Забыли пароль?
        </Button>
      </Typography>
      <Typography align="center">
        Нет аккаунта? <Button variant="text" onClick={() => navigate('/register')}>Зарегистрироваться</Button>
      </Typography>
    </Box>
  );
};

export default Login;
