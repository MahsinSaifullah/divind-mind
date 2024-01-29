import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String },
  type: { type: String, enum: ['creator', 'player'], required: true },
  code: { type: String, default: null },
});

export const userModel = mongoose.model('User', userSchema);
