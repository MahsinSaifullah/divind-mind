export interface IUser {
  id: string,
  username: string;
  type: IUserType;
  password?: string;
  code?: string;
}

export type IUserType = 'creator' | 'player';
