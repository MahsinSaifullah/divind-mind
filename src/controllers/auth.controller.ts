import { Request, Response } from 'express';
import { authService, userService, validationService } from '../services';
import { IUser } from 'types';
import { gameConfig } from '../configs';

const register = async (req: Request, res: Response) => {
  try {
    validationService.validateRegisterRequestBody(req.body);

    if (!(await userService.isUsernameUnique(req.body.username))) {
      throw new Error('Username must be unique');
    }

    if(req.body.type === 'player' && (await userService.getNumberOfUsersWithCode(req.body.code) > gameConfig.defaultPlayersLimit)) {
      throw new Error('Players limit reached for that code');
    }
  } catch (error: any) {
    res.sendStatus(400).json(error.message);
    console.log(error.message)
  }

  try {
    let newUserToCreate: IUser = req.body

    if(req.body.type === 'creator'){
      const hashPassword = await authService.hashPassword(req.body.password);
      newUserToCreate = {
        ...req.body,
        password: hashPassword,
      }
    }

    const newUser = await userService.createUser(newUserToCreate);

    const token = await authService.encodeJWT(newUser);

    res.sendStatus(201).json({ user: newUser, token });
  } catch (error: any) {
    res.sendStatus(500).json('Unable to register user due to a server issue');
    console.log(error.message)
  }
};

export const authController = {
  register,
};
