import { get, post, patch } from '@/utils/http/axios';
import { CreateAccount, RecoverAccount, UserWithToken, AccessToken, CheckNameRes, GoogleSignRes } from './types';
import { SignInForm } from '@/store/modules/user/types';
import { ResponseMessage } from '@/utils/http/axios/type';

const baseUrl = '/auth';
enum URL {
  signIn = baseUrl + '/signin',
  signUp = baseUrl + '/signup',
  signOut = baseUrl + '/signout',
  checkAccessToken = baseUrl + '/check-token',
  generateRecoveryKey = baseUrl + '/generate-recovery-key',
  recoverAccount = baseUrl + '/recover-account',
  verifyAccount = baseUrl + '/account-verification',
  refreshToken = baseUrl + '/refresh-token',
  checkName = baseUrl + '/check-name',
}

const signIn = async (data: SignInForm) => post<UserWithToken>({ url: URL.signIn, data });
const signUp = async (data: CreateAccount) => post<ResponseMessage>({ url: URL.signUp, data });
const signOut = async () => get<ResponseMessage>({ url: URL.signOut });
const checkAccessToken = async () => get<ResponseMessage>({ url: URL.checkAccessToken });
const checkName = async (data: { username: string }) => post<CheckNameRes>({ url: URL.checkName, data });
const generateRecoveryKey = async (data: { email: string }) => patch<ResponseMessage>({ url: URL.generateRecoveryKey, data });
const recoverAccount = async (data: RecoverAccount) => patch<ResponseMessage>({ url: URL.recoverAccount, data });
const verifyAccount = async (token: string) => get<ResponseMessage>({ url: URL.verifyAccount, params: { token: token } });
const refreshToken = async (refresh_token: string) => get<AccessToken>({ url: URL.refreshToken, params: { refreshToken: refresh_token } });

const googleSignIn = async (credential: string) => post<GoogleSignRes>({ url: baseUrl + '/google', data: { credential } });
export {
  signIn,
  checkName,
  signUp,
  signOut,
  recoverAccount,
  verifyAccount,
  generateRecoveryKey,
  refreshToken,
  checkAccessToken,
  googleSignIn,
};
