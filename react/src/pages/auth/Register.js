import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../../api/auth';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      navigate('/');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password || !name || !age) {
      setError('Все поля обязательны для заполнения');
      return;
    }
    mutation.mutate({ email, password, name, gender, age: parseInt(age) });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Регистрация
      </Typography>

      {error && (
        <Typography color="error" align="center" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <TextField
        fullWidth
        margin="normal"
        label="Имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
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
      <FormControl fullWidth margin="normal">
        <InputLabel>Пол</InputLabel>
        <Select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          label="Пол"
        >
          <MenuItem value="male">Мужской</MenuItem>
          <MenuItem value="female">Женский</MenuItem>
          <MenuItem value="other">Другое</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        margin="normal"
        label="Возраст"
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
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
        {mutation.isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
      </Button>
      <Typography align="center">
        Уже есть аккаунт? <Button variant="text" onClick={() => navigate('/login')}>Войти</Button>
      </Typography>
    </Box>
  );
};

export default Register;
