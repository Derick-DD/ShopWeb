import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { showMessage } from './status';
import { IResponse } from './type';
import { Action, ElMessage, ElMessageBox } from 'element-plus';
import { useUserStore } from '@/store';

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// axios request interceptor
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { ifSignIn, token } = useUserStore();
    if (ifSignIn) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// axios response interceptor
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    const { code, msg } = res;
    if (code === 200) {
      return res;
    } else if (code === 401) {
      handleUnauthoried();
    } else {
      ElMessage({
        message: msg || 'Error',
        type: 'error',
        duration: 5 * 1000,
      });
    }
    return Promise.reject(new Error(msg || 'Error'));
  },
  // request fail
  (error: any) => {
    const { response } = error;
    console.log(error);
    if (response) {
      if (response.data) {
        const { code, msg } = response.data;
        if (code === 401) {
          handleUnauthoried();
        } else {
          ElMessage({
            message: msg || 'Error',
            type: 'error',
            duration: 5 * 1000,
          });
        }
      } else {
        ElMessage({
          message: showMessage(response.status),
          type: 'error',
          duration: 5 * 1000,
        });
      }
      return Promise.reject(new Error(response.data.msg || 'Error'));
    }
    ElMessage({
      message: 'Connection error, please try again later.',
      type: 'error',
      duration: 5 * 1000,
    });
  },
);

//check and refresh user status
function handleUnauthoried() {
  const useStore = useUserStore();
  const { ifSignIn, refresh_token } = useStore;
  if (ifSignIn) {
    if (refresh_token) {
      try {
        useStore.refreshToken();
        return;
      } catch (err) {}
    }
    ElMessageBox.confirm('Your account has expired, please sign in again', {
      confirmButtonText: 'Sign In',
      cancelButtonText: 'Cancel',
      type: 'warning',
      callback: async (action: Action) => {
        await useStore.signOut();
        if (action === 'confirm') {
          useStore.popSignIn();
        }
      },
    });
  } else {
    ElMessage.warning('Please sign in');
    useStore.popSignIn();
  }
}

export function get<T = any>(config: AxiosRequestConfig): Promise<IResponse<T>> {
  return service.request({ ...config, method: 'GET' });
}

export function post<T = any>(config: AxiosRequestConfig): Promise<IResponse<T>> {
  return service.request({ ...config, method: 'POST' });
}

export function patch<T = any>(config: AxiosRequestConfig): Promise<IResponse<T>> {
  return service.request({ ...config, method: 'patch' });
}

export function del<T = any>(config: AxiosRequestConfig): Promise<IResponse<T>> {
  return service.request({ ...config, method: 'delete' });
}

export default service;
