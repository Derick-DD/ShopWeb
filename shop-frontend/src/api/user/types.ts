// export interface ReqParams {
//   username: string;
//   password: string;
// }

// export interface ReqAuth {
//   auths: string[];
//   modules: string[];
//   is_admin?: 0 | 1;
// }

// export interface ResResult {
//   data?: ResResultData;
//   status: string | '';
//   headers: object;
// }
// export interface ResResultData {
//   code?: number;
//   result?: any;
//   message: string;
//   status: string;
// }
import { UserRole } from '@/store/modules/user/types';
import { BaseInfoRes } from '@/utils/http/axios/type';

export interface UserInfo extends BaseInfoRes {
  username: string;
  email: string;
  avatar: string;
  biography: string;
  role: UserRole;
  refresh_token?: string;
}

export interface UserAvatar {
  avatar: string;
}

export interface UserProfile {
  username: string;
  email: string;
  biography: string;
  password: string;
  oldPassword: string;
}

export interface Avatar {
  type: 'avatar';
  attributes: {
    avatar: string;
  };
}
export interface BanChange {
  username: string;
  banSituation: boolean;
}
