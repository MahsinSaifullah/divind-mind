export interface IUser {
  username: string;
  type: IUserType;
  password?: string;
  code?: string;
}

export type IUserType = 'creator' | 'player';
