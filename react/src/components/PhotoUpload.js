import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import { uploadPhoto } from '../api/photo';

const PhotoUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Пожалуйста, выберите фотографию для загрузки.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result;
        await uploadPhoto(base64Data);
        setLoading(false);
        setSuccess(true);
        setFile(null);
        setPreview(null);
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setLoading(false);
      setError('Ошибка при загрузке фотографии. Попробуйте снова.');
      console.error(err);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', p: 3, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Загрузить фотографию
      </Typography>
      <Box sx={{ mt: 2, mb: 3 }}>
        <input
          accept="image/*"
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="photo-upload-input"
        />
        <label htmlFor="photo-upload-input">
          <Button variant="contained" component="span" disabled={loading}>
            Выбрать фотографию
          </Button>
        </label>
        {preview && (
          <Box sx={{ mt: 2 }}>
            <img
              src={preview}
              alt="Предпросмотр"
              style={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain' }}
            />
            <Typography variant="body2" sx={{ mt: 1 }}>
              {file?.name}
            </Typography>
          </Box>
        )}
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!file || loading}
        sx={{ mb: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Загрузить'}
      </Button>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Фотография успешно загружена!
        </Alert>
      )}
    </Box>
  );
};

export default PhotoUpload;
