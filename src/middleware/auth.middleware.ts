import { NextFunction, Request, Response } from 'express';
import { IUser, IUserType } from '../types';
import { authService } from 'services';

export const authMiddleware =
  (type: IUserType) => (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res
        .status(401)
        .json({ error: 'Unauthorized, token is missing', status: 401 });
    }

    const user = authService.decodeJWT(token) as IUser;

    if (!user) {
      return res
        .status(401)
        .json({ error: 'Unauthorized, invalid token', status: 401 });
    }

    if (user.type !== type) {
      return res.status(401).json({
        error: `${
          type === 'player' ? 'Players' : 'Creators'
        } are not authorized to access this route`,
        status: 401,
      });
    }

    req.user = user
    next()
  };
