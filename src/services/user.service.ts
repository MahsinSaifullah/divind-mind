import { IUser } from '../types';
import { userModel } from '../models';

const createUser = async (newUser: IUser) => await userModel.create(newUser);

const getUserById = async (id: string) => await userModel.findById(id);

const getUserByUsername = async (username: string) => await userModel.findOne({ username });

const isUsernameUnique = async (username: string) => {
  const foundUser = await userModel.findOne({ username });

  if (!foundUser) return true;

  return false;
};
const getAllUsersByCode = async (code: string) =>
  await userModel.find({ code });

const getNumberOfUsersWithCode = async (code: string) =>
  await userModel.countDocuments({ code });

const updatePlayerCode = async (id: string, code: string) => await userModel.findByIdAndUpdate(id, { code })

const deleteUser = async (id: string) => await userModel.findByIdAndDelete(id);

export const userService = {
  createUser,
  getUserById,
  getUserByUsername,
  isUsernameUnique,
  getAllUsersByCode,
  getNumberOfUsersWithCode,
  updatePlayerCode,
  deleteUser,
};
