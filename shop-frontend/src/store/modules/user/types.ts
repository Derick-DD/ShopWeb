export type UserRole = 0 | 1 | 2 | undefined;

export interface GoogleInfo {
  google_id: string;
  google_name: string;
  google_email: string;
}

export interface UserState {
  user_id: string;
  username: string;
  avatar: string;
  biography: string;
  token: string;
  email: string;
  is_admin?: number;
  refresh_token: string;
  rememberMe: boolean;
  role: UserRole;
  signBoxStatus: boolean;
  googleInfo: GoogleInfo;
}

export interface SignInForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface PasswordChangeForm {
  password: string;
  confirmedPassword: string;
  oldPassword: string;
}
