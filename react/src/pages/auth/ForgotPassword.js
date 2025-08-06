import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from '../../api/auth';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      setSuccessMessage(`Инструкции по восстановлению пароля отправлены на ${email}. Токен: ${data.resetToken}`);
      setEmail('');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Ошибка отправки запроса');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    if (!email) {
      setError('Введите email');
      return;
    }
    mutation.mutate(email);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Восстановление пароля
      </Typography>

      {error && (
        <Typography color="error" align="center" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {successMessage && (
        <Typography color="success.main" align="center" sx={{ mb: 2 }}>
          {successMessage}
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
        disabled={!!successMessage}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        sx={{ mt: 3, mb: 2 }}
        disabled={mutation.isLoading || !!successMessage}
      >
        {mutation.isLoading ? 'Отправка...' : 'Отправить инструкции'}
      </Button>
      <Typography align="center">
        <Button variant="text" onClick={() => navigate('/login')}>
          Вернуться ко входу
        </Button>
      </Typography>
    </Box>
  );
};

export default ForgotPassword;
