import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPhotoStats } from '../../api/photoStats';
import { Box, Typography, Paper, CircularProgress, Divider } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PhotoStats = () => {
  const { photoId } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getPhotoStats(photoId);
        setStats(data.stats);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Ошибка загрузки статистики');
        setLoading(false);
      }
    };

    fetchStats();
  }, [photoId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <Typography variant="h6">Данные отсутствуют</Typography>
      </Box>
    );
  }

  const genderData = [
    { name: 'Мужчины', count: stats.byGender.male.count, average: stats.byGender.male.average },
    { name: 'Женщины', count: stats.byGender.female.count, average: stats.byGender.female.average },
    { name: 'Другие', count: stats.byGender.other.count, average: stats.byGender.other.average },
  ];

  const ageData = [
    { name: '18-25', count: stats.byAge['18-25'].count, average: stats.byAge['18-25'].average },
    { name: '26-35', count: stats.byAge['26-35'].count, average: stats.byAge['26-35'].average },
    { name: '36+', count: stats.byAge['36+'].count, average: stats.byAge['36+'].average },
  ];

  return (
    <Box sx={{ padding: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom align="center">
        Статистика по фотографии
      </Typography>
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h6">Общая информация</Typography>
        <Divider sx={{ marginY: 1 }} />
        <Typography>Всего оценок: {stats.totalRatings}</Typography>
        <Typography>Средняя оценка: {stats.averageScore.toFixed(2)}</Typography>
      </Paper>

      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h6" gutterBottom>Оценки по полу</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={genderData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `Средняя оценка: ${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="average" fill="#8884d8" name="Средняя оценка" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h6" gutterBottom>Оценки по возрасту</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `Средняя оценка: ${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="average" fill="#82ca9d" name="Средняя оценка" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default PhotoStats;
