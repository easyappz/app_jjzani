import React from 'react';
import { Box, Typography, Button, Container, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../api/user';

const Home = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const { data: profileData, isLoading, isError } = useQuery(
    ['profile'],
    getProfile,
    {
      enabled: isAuthenticated,
      retry: false,
    }
  );

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Добро пожаловать в ФотоОценку!
        </Typography>
        <Typography variant="h6" component="p" color="text.secondary" gutterBottom>
          Загружайте свои фотографии, оценивайте работы других и получайте баллы.
        </Typography>

        {!isAuthenticated ? (
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ mr: 2 }}
            >
              Зарегистрироваться
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
            >
              Войти
            </Button>
          </Box>
        ) : (
          <Box sx={{ mt: 4 }}>
            {isLoading ? (
              <Typography>Загрузка профиля...</Typography>
            ) : isError ? (
              <Typography color="error">Ошибка загрузки профиля</Typography>
            ) : (
              <Typography variant="h6">
                У вас {profileData?.user?.points || 0} баллов
              </Typography>
            )}
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/rating')}
              sx={{ mt: 2 }}
            >
              Оценить фотографии
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image="https://source.unsplash.com/random/400x300?photo"
              alt="Фото"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Загрузка
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Загружайте свои фотографии и получайте оценки от других пользователей.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image="https://source.unsplash.com/random/400x300?rating"
              alt="Оценка"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Оценка
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Оценивайте фотографии других и зарабатывайте баллы для продвижения своих работ.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image="https://source.unsplash.com/random/400x300?stats"
              alt="Статистика"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Статистика
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Получайте детальную статистику по оценкам ваших фотографий.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
