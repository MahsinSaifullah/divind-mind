import { Request, Response } from 'express';

import {
  authService,
  gameService,
  userService,
  validationService,
} from '../services';
import { IUserType } from '../types';
import { gameConfig } from '../configs';
import { userDTO } from '../dtos';

const register = async (req: Request, res: Response) => {
  const userType: IUserType = req.body.type;

  try {
    validationService.validateAuthRequestBody(req.body);

    if (!(await userService.isUsernameUnique(req.body.username))) {
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
    let requestBody = req.body;
    
    if (userType === 'creator') {
      const hashPassword = await authService.hashPassword(req.body.password);
       requestBody = {
        ...req.body,
        password: hashPassword,
      };
    }

    const createdUser = await userService.createUser(requestBody);

    if (!createdUser) {
      throw new Error('Unable to register user due to database issue');
    }

    

    if (userType === 'player') {
      await gameService.addPlayerToGameWithCode(
        userDTO(createdUser).code as string,
        userDTO(createdUser).id
      );
    }

    const token = await authService.encodeJWT(userDTO(createdUser));

    return res.status(201).json({
      user: userDTO(createdUser),
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

   

    const token = await authService.encodeJWT(userDTO(user));

    return res.status(200).json({
      user: userDTO(user),
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
