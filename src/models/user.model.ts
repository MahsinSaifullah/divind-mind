import mongoose from 'mongoose';
import { IUser } from 'types';

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String },
  type: { type: String, enum: ['creator', 'player'], required: true },
  code: { type: String, default: null },
});

export const userModel = mongoose.model<IUser>('User', userSchema);
