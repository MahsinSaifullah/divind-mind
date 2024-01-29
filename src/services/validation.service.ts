import { IUser } from 'types';

const validateRegisterRequestBody = (requestBody: IUser) => {
  const { username, password, type, code } = requestBody;

  if (!username) throw new Error('Username is required');

  if (type === 'creator' && !password) {
    throw new Error('Password is required for a creator');
  }

  if(type === 'player' && !code){
    throw new Error('Code is required for a player');
  }

  return true;
};

export const validationService = {
  validateRegisterRequestBody,
};
