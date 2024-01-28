import { IUser } from 'types';
import { userModel } from '../models';

export const createUser = async (newUser: IUser) =>
  await userModel.create(newUser);

export const getUserById = async (id: string) => await userModel.findById(id);

export const getUserByUsername = async (username: string) =>
  await userModel.findOne({ username });

export const getAllUsersByCode = async (code: string) =>
  await userModel.find({ code });

export const getNumberOfUsersWithCode = async (code: string) =>
  await userModel.countDocuments({ code });

export const deleteUser = async (id: string) =>
  await userModel.findByIdAndDelete(id);
