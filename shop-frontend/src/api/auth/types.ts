import { UserInfo } from '../user/types';

export interface UserWithToken {
  access_token: string;
  user: UserInfo;
}

export interface AccessToken {
  access_token: string;
}

export interface CreateAccount {
  email: string;
  username: string;
  password: string;
  googleId?: string;
  googleEmail?: string;
}

export interface RecoverAccount {
  email: string;
  recoveryKey: string;
  password: string;
}

export interface CheckNameRes {
  used: boolean;
}

export interface GoogleSignRes {
  ifExists: boolean;
  access_token?: string;
  user?: UserInfo;
}
