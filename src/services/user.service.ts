import { IUser } from 'types';
import { userModel } from '../models';

const createUser = async (newUser: IUser) => await userModel.create(newUser);

const getUserById = async (id: string) => await userModel.findById(id);

const getUserByUsername = async (username: string) =>
  await userModel.findOne({ username });

const getAllUsersByCode = async (code: string) =>
  await userModel.find({ code });

const getNumberOfUsersWithCode = async (code: string) =>
  await userModel.countDocuments({ code });

const deleteUser = async (id: string) => await userModel.findByIdAndDelete(id);

export const userService = {
  createUser,
  getUserById,
  getUserByUsername,
  getAllUsersByCode,
  getNumberOfUsersWithCode,
  deleteUser,
};
