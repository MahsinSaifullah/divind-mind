import { IUser } from '../user.type';

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: IUser;
    }
  }
}
