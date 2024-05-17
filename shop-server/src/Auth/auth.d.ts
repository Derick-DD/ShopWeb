import { UserInfo } from '../user/user';

export interface UserWithToken {
  access_token: string;
  user: UserInfo;
}

export interface AccessToken {
  access_token: string;
}

export interface CheckNameRes {
  used: boolean;
}

export interface GoogleUser {
  ifExists: boolean;
  access_token?: string;
  user?: UserInfo;
}
