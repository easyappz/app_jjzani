const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  age: { type: Number, required: true },
  points: { type: Number, default: 10 },
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
