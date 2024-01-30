import { Request, Response } from 'express';

import {
  authService,
  gameService,
  userService,
  validationService,
} from 'services';
import { IUser, IUserType } from 'types';
import { gameConfig } from 'configs';

const register = async (req: Request, res: Response) => {
  const userType: IUserType = req.body.type;

  try {
    validationService.validateAuthRequestBody(req.body);

    if (
      userType === 'creator' &&
      !(await userService.isUsernameUnique(req.body.username))
    ) {
      throw new Error('Username must be unique');
    }

    if (
      userType === 'player' &&
      !(await gameService.getGameByCode(req.body.code))
    ) {
      throw new Error('A Game with that code does not exist');
    }

    const playersLimit =
      (await gameService.getGameByCode(req.body.code))?.maxPlayerLimit ||
      gameConfig.defaultPlayersLimit;

    if (
      userType === 'player' &&
      (await userService.getNumberOfUsersWithCode(req.body.code)) > playersLimit
    ) {
      throw new Error('Players limit reached for that code');
    }
  } catch (error: any) {
    console.log(error.message);
    return res.status(400).json({ error: error.message, status: 400 });
  }

  try {
    let createdUser;

    // create user if its a creator
    if (userType === 'creator') {
      const hashPassword = await authService.hashPassword(req.body.password);
      createdUser = await userService.createUser({
        ...req.body,
        password: hashPassword,
      });
    }

    // create user if its a unique player
    if (
      userType === 'player' &&
      (await userService.isUsernameUnique(req.body.username))
    ) {
      createdUser = await userService.createUser(req.body);
    }

    // get user if player already exist
    if (
      userType === 'player' &&
      !(await userService.isUsernameUnique(req.body.username))
    ) {
      createdUser = await userService.getUserByUsername(req.body.username);
    }

    if (!createdUser) {
      throw new Error('Unable to register user due to database issue');
    }

    const userDTO: IUser = {
      id: createdUser._id as unknown as string,
      username: createdUser.username,
      code: createdUser.code,
      type: createdUser.type,
    };

    const token = await authService.encodeJWT(userDTO);

    return res.status(201).json({
      user: userDTO,
      token,
    });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      error: 'Unable to register user due to a server issue',
      status: 500,
    });
  }
};

const login = async (req: Request, res: Response) => {
  const userType: IUserType = req.body.type;

  if (userType === 'player') {
    return res
      .status(403)
      .json({ error: 'Players cannot access this route', status: 403 });
  }

  try {
    validationService.validateAuthRequestBody(req.body);
  } catch (error: any) {
    console.log(error.message);
    return res.status(400).json({ error: error.message, status: 400 });
  }

  try {
    const user = await userService.getUserByUsername(req.body.username);

    if (!user) {
      return res
        .status(400)
        .json({ error: 'User with that username does not exist', status: 400 });
    }

    if (
      !(await authService.isPasswordMatch(
        req.body.password,
        user.password as string
      ))
    ) {
      return res.status(400).json({ error: 'Invalid Password', status: 400 });
    }

    const userDTO: IUser = {
      id: user._id as unknown as string,
      username: user.username,
      type: user.type,
    };

    const token = await authService.encodeJWT(userDTO);

    return res.status(200).json({
      user: userDTO,
      token,
    });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      error: 'Unable to login user due to a server issue',
      status: 500,
    });
  }
};

export const authController = {
  register,
  login,
};
