import { Document, Types } from 'mongoose';
import { IUser } from '../types';

export const userDTO = (
  userDoc: Document<unknown, {}, IUser> &
    IUser & {
      _id: Types.ObjectId;
    }
): IUser => {
  return {
    id: userDoc._id as unknown as string,
    username: userDoc.username,
    code: userDoc.code,
    type: userDoc.type,
  };
};
