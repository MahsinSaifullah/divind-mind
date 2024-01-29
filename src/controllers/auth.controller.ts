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
    console.log(error.message)
    return res.status(400).json({error: error.message, status: 400});
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

    const userDTO: IUser = {
      id: newUser._id as unknown as string, 
      username: newUser.username, 
      code: newUser.code,
      type: newUser.type
    }


    const token = await authService.encodeJWT(userDTO);

    return res.status(201).json({ 
      user: userDTO, 
      token 
    });
  } catch (error: any) {
    console.log(error.message)
    return res.status(500).json({error: 'Unable to register user due to a server issue', status: 500});
  }
};

export const authController = {
  register,
};
