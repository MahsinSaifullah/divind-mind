import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { IUser } from '../types';
import { environmentConfig } from '../configs';

const hashPassword = async (password: string) =>
  await bcrypt.hash(password, 10);

const isPasswordMatch = async (password: string, hash: string) =>
  await bcrypt.compare(password, hash);

const encodeJWT = (userData: Omit<IUser, 'password'>) =>
  jwt.sign(userData, environmentConfig.jwtSecret as string);

const decodeJWT = (token: string) => {
  try {
    return jwt.verify(token, environmentConfig.jwtSecret as string);
  } catch (error) {
    return null;
  }
};

export const authService = {
  hashPassword,
  isPasswordMatch,
  encodeJWT,
  decodeJWT,
};
