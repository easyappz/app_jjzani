import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '../../api/auth';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      setSuccessMessage('Пароль успешно изменен. Теперь вы можете войти с новым паролем.');
      setNewPassword('');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Ошибка изменения пароля');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    if (!newPassword) {
      setError('Введите новый пароль');
      return;
    }
    mutation.mutate(token, newPassword);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Сброс пароля
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
        label="Новый пароль"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
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
        {mutation.isLoading ? 'Сброс...' : 'Сбросить пароль'}
      </Button>
      <Typography align="center">
        <Button variant="text" onClick={() => navigate('/login')}>
          Вернуться ко входу
        </Button>
      </Typography>
    </Box>
  );
};

export default ResetPassword;
