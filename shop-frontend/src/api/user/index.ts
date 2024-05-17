import { get, patch, del } from '@/utils/http/axios';
import { BanChange, UserAvatar, UserInfo, UserProfile } from './types';
import { ResponseMessage } from '@/utils/http/axios/type';

const baseURL = '/user';

enum URL {
  updateUser = baseURL + '/update',
  Avatar = baseURL + '/avatar',
  BanChange = baseURL + '/ban-situation/',
  verifyUpdatedEmail = baseURL + '/verify-updated-email',
  disableuSER = baseURL + '/disable',
  sendActivationMail = baseURL + '/send-activation-mail',
  activateUser = baseURL + '/activate-user',
}

const updateUser = async (data: Partial<UserProfile>) => patch<UserInfo>({ url: URL.updateUser, data });
const uploadAvatar = async (file: File) =>
  get<UserAvatar>({ url: URL.Avatar, data: file, headers: { 'Content-Type': 'multipart/form-data' } });
const deleteAvatar = async () => del<ResponseMessage>({ url: URL.Avatar });
const banChange = async (data: BanChange) => patch<ResponseMessage>({ url: URL.BanChange, data });
const verifyUpdatedEmail = async (token: string) => get<ResponseMessage>({ url: URL.verifyUpdatedEmail, params: { token: token } });
const disableuSER = async () => patch<ResponseMessage>({ url: URL.disableuSER });
const sendActivationMail = async (data: { email: string }) => get<ResponseMessage>({ url: URL.sendActivationMail, data: data });
const activateUser = async (token: string) => get<ResponseMessage>({ url: URL.activateUser, params: { token: token } });
export { updateUser, uploadAvatar, deleteAvatar, banChange, verifyUpdatedEmail, activateUser, disableuSER, sendActivationMail };
