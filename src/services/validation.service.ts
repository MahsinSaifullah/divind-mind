import { IUser } from 'types';

const validateRegisterRequestBody = (requestBody: Omit<IUser, 'code'>) => {
  const { username, password, type } = requestBody;

  if (!username) throw new Error('Username is required');

  if (type === 'creator' && !password) {
    throw new Error('Password is required for a creator');
  }

  return true;
};

export const validationService = {
  validateRegisterRequestBody,
};
