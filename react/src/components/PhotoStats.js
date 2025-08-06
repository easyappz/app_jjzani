import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { getPhotoStats } from '../api/photo';

const PhotoStats = ({ photoId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getPhotoStats(photoId);
        setStats(data.stats);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError('Ошибка при загрузке статистики. Попробуйте снова.');
        console.error(err);
      }
    };

    fetchStats();
  }, [photoId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ p: 3, textAlign: 'center' }}>
        Статистика для этой фотографии отсутствует.
      </Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom align="center">
        Статистика оценок
      </Typography>
      <Typography variant="body1" gutterBottom align="center">
        Всего оценок: {stats.totalRatings}
      </Typography>
      <Typography variant="body1" gutterBottom align="center">
        Средняя оценка: {stats.averageScore.toFixed(2)}
      </Typography>

      <Typography variant="h6" sx={{ mt: 3 }} align="center">
        Оценки по полу
      </Typography>
      <Table sx={{ mt: 1, mb: 3 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Пол</TableCell>
            <TableCell align="right">Количество</TableCell>
            <TableCell align="right">Средняя оценка</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Мужской</TableCell>
            <TableCell align="right">{stats.byGender.male.count}</TableCell>
            <TableCell align="right">{stats.byGender.male.average.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Женский</TableCell>
            <TableCell align="right">{stats.byGender.female.count}</TableCell>
            <TableCell align="right">{stats.byGender.female.average.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Другое</TableCell>
            <TableCell align="right">{stats.byGender.other.count}</TableCell>
            <TableCell align="right">{stats.byGender.other.average.toFixed(2)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Typography variant="h6" sx={{ mt: 3 }} align="center">
        Оценки по возрасту
      </Typography>
      <Table sx={{ mt: 1 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Возрастная группа</TableCell>
            <TableCell align="right">Количество</TableCell>
            <TableCell align="right">Средняя оценка</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>18-25</TableCell>
            <TableCell align="right">{stats.byAge['18-25'].count}</TableCell>
            <TableCell align="right">{stats.byAge['18-25'].average.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>26-35</TableCell>
            <TableCell align="right">{stats.byAge['26-35'].count}</TableCell>
            <TableCell align="right">{stats.byAge['26-35'].average.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>36+</TableCell>
            <TableCell align="right">{stats.byAge['36+'].count}</TableCell>
            <TableCell align="right">{stats.byAge['36+'].average.toFixed(2)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};

export default PhotoStats;
