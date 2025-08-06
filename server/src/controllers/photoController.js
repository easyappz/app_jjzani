const Photo = require('@src/models/Photo');
const User = require('@src/models/User');

// Upload photo
exports.uploadPhoto = async (req, res) => {
  try {
    const userId = req.userId;
    const { imageData } = req.body;

    // Check image size (limit to 1MB)
    if (Buffer.byteLength(imageData, 'utf8') > 1024 * 1024) {
      return res.status(400).json({ message: 'Image size exceeds 1MB limit' });
    }

    const photo = new Photo({ userId, imageData });
    await photo.save();
    res.status(201).json({ message: 'Photo uploaded successfully', photoId: photo._id });
  } catch (error) {
    res.status(500).json({ message: 'Photo upload failed', error: error.message });
  }
};

// Add photo to rating list
exports.addToRatingList = async (req, res) => {
  try {
    const userId = req.userId;
    const { photoId } = req.body;
    const user = await User.findById(userId);
    if (user.points < 1) {
      return res.status(400).json({ message: 'Not enough points to add photo to rating list' });
    }
    const photo = await Photo.findOne({ _id: photoId, userId });
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    photo.isActive = true;
    await photo.save();
    user.points -= 1;
    await user.save();
    res.json({ message: 'Photo added to rating list', points: user.points });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add photo to rating list', error: error.message });
  }
};

// Remove photo from rating list
exports.removeFromRatingList = async (req, res) => {
  try {
    const userId = req.userId;
    const { photoId } = req.body;
    const photo = await Photo.findOne({ _id: photoId, userId });
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    photo.isActive = false;
    await photo.save();
    res.json({ message: 'Photo removed from rating list' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove photo from rating list', error: error.message });
  }
};

// Get photos for rating with filters
exports.getPhotosForRating = async (req, res) => {
  try {
    const userId = req.userId;
    const { gender, minAge, maxAge } = req.query;
    const query = { userId: { $ne: userId }, isActive: true };

    if (gender) {
      query['user.gender'] = gender;
    }
    if (minAge && maxAge) {
      query['user.age'] = { $gte: Number(minAge), $lte: Number(maxAge) };
    }

    const photos = await Photo.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $match: query },
      { $project: { imageData: 1, userId: 1, 'user.gender': 1, 'user.age': 1 } }
    ]);

    res.json({ photos });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch photos for rating', error: error.message });
  }
};

// Rate a photo
exports.ratePhoto = async (req, res) => {
  try {
    const userId = req.userId;
    const { photoId, score } = req.body;

    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    if (photo.userId.toString() === userId.toString()) {
      return res.status(400).json({ message: 'Cannot rate your own photo' });
    }

    const user = await User.findById(userId);
    const photoOwner = await User.findById(photo.userId);

    photo.ratings.push({ userId, score, gender: user.gender, age: user.age });
    await photo.save();

    user.points += 1;
    photoOwner.points -= 1;
    await user.save();
    await photoOwner.save();

    res.json({ message: 'Photo rated successfully', points: user.points });
  } catch (error) {
    res.status(500).json({ message: 'Failed to rate photo', error: error.message });
  }
};

// Get rating statistics for a photo
exports.getRatingStats = async (req, res) => {
  try {
    const userId = req.userId;
    const { photoId } = req.params;
    const photo = await Photo.findOne({ _id: photoId, userId });
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    const stats = {
      totalRatings: photo.ratings.length,
      averageScore: photo.ratings.length > 0 ? photo.ratings.reduce((acc, r) => acc + r.score, 0) / photo.ratings.length : 0,
      byGender: {
        male: {
          count: photo.ratings.filter(r => r.gender === 'male').length,
          average: photo.ratings.filter(r => r.gender === 'male').length > 0 
            ? photo.ratings.filter(r => r.gender === 'male').reduce((acc, r) => acc + r.score, 0) / photo.ratings.filter(r => r.gender === 'male').length 
            : 0
        },
        female: {
          count: photo.ratings.filter(r => r.gender === 'female').length,
          average: photo.ratings.filter(r => r.gender === 'female').length > 0 
            ? photo.ratings.filter(r => r.gender === 'female').reduce((acc, r) => acc + r.score, 0) / photo.ratings.filter(r => r.gender === 'female').length 
            : 0
        },
        other: {
          count: photo.ratings.filter(r => r.gender === 'other').length,
          average: photo.ratings.filter(r => r.gender === 'other').length > 0 
            ? photo.ratings.filter(r => r.gender === 'other').reduce((acc, r) => acc + r.score, 0) / photo.ratings.filter(r => r.gender === 'other').length 
            : 0
        }
      },
      byAge: {
        '18-25': {
          count: photo.ratings.filter(r => r.age >= 18 && r.age <= 25).length,
          average: photo.ratings.filter(r => r.age >= 18 && r.age <= 25).length > 0 
            ? photo.ratings.filter(r => r.age >= 18 && r.age <= 25).reduce((acc, r) => acc + r.score, 0) / photo.ratings.filter(r => r.age >= 18 && r.age <= 25).length 
            : 0
        },
        '26-35': {
          count: photo.ratings.filter(r => r.age >= 26 && r.age <= 35).length,
          average: photo.ratings.filter(r => r.age >= 26 && r.age <= 35).length > 0 
            ? photo.ratings.filter(r => r.age >= 26 && r.age <= 35).reduce((acc, r) => acc + r.score, 0) / photo.ratings.filter(r => r.age >= 26 && r.age <= 35).length 
            : 0
        },
        '36+': {
          count: photo.ratings.filter(r => r.age >= 36).length,
          average: photo.ratings.filter(r => r.age >= 36).length > 0 
            ? photo.ratings.filter(r => r.age >= 36).reduce((acc, r) => acc + r.score, 0) / photo.ratings.filter(r => r.age >= 36).length 
            : 0
        }
      }
    };

    res.json({ stats });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch rating stats', error: error.message });
  }
};
