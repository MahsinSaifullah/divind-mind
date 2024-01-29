import { Request, Response } from 'express';
import { authService, userService, validationService } from '../services';
import { IUser } from 'types';
import { gameConfig } from '../configs';

const register = async (req: Request, res: Response) => {
  try {
    validationService.validateAuthRequestBody(req.body);

    if (req.body.type === 'creator' && !(await userService.isUsernameUnique(req.body.username))) {
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
    let createdUser;

    // create user if its a creator 
    if(req.body.type === 'creator' ){
      const hashPassword = await authService.hashPassword(req.body.password);
      createdUser = await userService.createUser({
        ...req.body,
        password: hashPassword,
      })
    }

    // create user if its a unique player 
    if(req.body.type === 'player' && await userService.isUsernameUnique(req.body.username)){
      createdUser = await userService.createUser(req.body)
    }

    // get user if player already exist
    if(req.body.type === 'player' && !(await userService.isUsernameUnique(req.body.username))) {
      createdUser = await userService.getUserByUsername(req.body.username)
    }

    if(!createdUser){
      throw new Error('Unable to register user due to database issue')
    }

    const userDTO: IUser = {
      id: createdUser._id as unknown as string, 
      username: createdUser.username, 
      code: createdUser.code,
      type: createdUser.type
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
