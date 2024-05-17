export interface UserInfo {
  id: string;
  username: string;
  email: string;
  avatar: string;
  biography: string;
  role: number;
  refresh_token: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserAvatar {
  avatar: string;
}
