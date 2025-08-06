import React, { useState } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl, CircularProgress } from '@mui/material';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getProfile, updateProfile } from '../../api/user';

const Profile = () => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { data, isLoading, isError, error } = useQuery(
    ['profile'],
    getProfile,
    {
      onSuccess: (data) => {
        setName(data.user.name);
        setGender(data.user.gender);
        setAge(data.user.age.toString());
      },
    }
  );

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      setSuccessMessage('Профиль успешно обновлен');
      setErrorMessage('');
    },
    onError: (err) => {
      setErrorMessage(err.response?.data?.message || 'Ошибка обновления профиля');
      setSuccessMessage('');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ name, gender, age: parseInt(age) });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography color="error">Ошибка загрузки профиля: {error.message}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Профиль
      </Typography>

      <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h6" gutterBottom>
          Email: {data?.user?.email}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Баллы: {data?.user?.points}
        </Typography>

        {successMessage && (
          <Typography color="success.main" sx={{ mt: 2 }}>
            {successMessage}
          </Typography>
        )}
        {errorMessage && (
          <Typography color="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            sx={{ mt: 3 }}
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Profile;
