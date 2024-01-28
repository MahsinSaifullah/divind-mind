import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser } from '../types';

export const hashPassword = async (password: string) =>
  await bcrypt.hash(password, 10);

export const isPasswordValid = async (password: string, hash: string) =>
  await bcrypt.compare(password, hash);

export const encodeJWT = (userData: Omit<IUser, 'password'>) =>
  jwt.sign(userData, process.env.SECRET_KEY as string);

export const decodeJWT = (token: string) => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY as string);
  } catch (error) {
    return null;
  }
};
