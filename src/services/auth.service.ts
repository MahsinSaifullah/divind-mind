import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser } from '../types';

const hashPassword = async (password: string) =>
  await bcrypt.hash(password, 10);

const isPasswordValid = async (password: string, hash: string) =>
  await bcrypt.compare(password, hash);

const encodeJWT = (userData: Omit<IUser, 'password'>) =>
  jwt.sign(userData, process.env.SECRET_KEY as string);

const decodeJWT = (token: string) => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY as string);
  } catch (error) {
    return null;
  }
};

export const authService = {
  hashPassword,
  isPasswordValid,
  encodeJWT,
  decodeJWT,
};
