import { Request, Response } from 'express';
import { authService, userService, validationService } from '../services';

const register = async (req: Request, res: Response) => {
  try {
    validationService.validateRegisterRequestBody(req.body);
    if (!(await userService.isUsernameUnique(req.body.username))) {
      throw new Error('Username must be unique');
    }
  } catch (error: any) {
    res.sendStatus(400).json(error.message);
  }

  try {
    const hashPassword = await authService.hashPassword(req.body.password);

    const newUser = await userService.createUser({
      ...req.body,
      password: hashPassword,
    });

    const token = await authService.encodeJWT(newUser);

    res.sendStatus(201).json({ user: newUser, token });
  } catch (error: any) {
    res.sendStatus(500).json('Unable to register user due to a server issue');
  }
};

export const authController = {
  register,
};
