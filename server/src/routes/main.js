const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authController = require('@src/controllers/authController');
const userController = require('@src/controllers/userController');
const photoController = require('@src/controllers/photoController');

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }
  try {
    const decoded = jwt.verify(token, 'mysecretkey123');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token', error: error.message });
  }
};

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// User routes
router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, userController.updateProfile);

// Photo routes
router.post('/photos/upload', authenticateToken, photoController.uploadPhoto);
router.post('/photos/add-to-rating', authenticateToken, photoController.addToRatingList);
router.post('/photos/remove-from-rating', authenticateToken, photoController.removeFromRatingList);
router.get('/photos/for-rating', authenticateToken, photoController.getPhotosForRating);
router.post('/photos/rate', authenticateToken, photoController.ratePhoto);
router.get('/photos/:photoId/stats', authenticateToken, photoController.getRatingStats);

module.exports = router;
