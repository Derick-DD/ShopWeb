import { defineStore } from 'pinia';
import { UserState, SignInForm, UserRole, PasswordChangeForm } from './types';
import { googleSignIn, refreshToken as userRefreshToken, signIn as userSignIn } from '@/api/auth';
import { useCartStore } from '../cart';
import { updateUser } from '@/api/user';
import { UserInfo, UserProfile } from '@/api/user/types';
import router from '@/router';
import { GoogleSignRes } from '@/api/auth/types';
import { ElMessage } from 'element-plus';

export const useUserStore = defineStore('user', {
  persist: true,
  state: (): UserState => ({
    token: '',
    refresh_token: '',
    user_id: '',
    username: '',
    avatar: '',
    email: '',
    biography: '',
    rememberMe: false,
    role: undefined,
    signBoxStatus: false,
    googleInfo: {
      google_id: '',
      google_email: '',
      google_name: '',
    },
  }),
  getters: {
    userProfile(state: UserState) {
      return { username: state.username, avatar: state.avatar, email: state.email };
    },
    getRole(state: UserState): string {
      if (state.role === undefined) {
        return 'undefined';
      } else if (state.role === 0) {
        return 'user';
      } else if (state.role === 1) {
        return 'admin';
      } else if (state.role === 2) {
        return 'superadmin';
      } else {
        return 'unknown';
      }
    },
    checkRole: (state: UserState) => {
      return (requiredRole: string): boolean => {
        let requiredRoleNumber: UserRole;
        switch (requiredRole) {
          case 'user':
            requiredRoleNumber = 0;
            break;
          case 'admin':
            requiredRoleNumber = 1;
            break;
          case 'superadmin':
            requiredRoleNumber = 2;
            break;
          default:
            requiredRoleNumber = undefined;
        }
        if (requiredRoleNumber && state.role && requiredRoleNumber <= state.role) {
          return true;
        } else {
          return false;
        }
      };
    },
    ifSignIn(state: UserState): boolean {
      if (state.user_id) {
        return true;
      }
      return false;
    },
  },
  actions: {
    async signIn(signForm: SignInForm): Promise<void> {
      const result = (await userSignIn(signForm)).data.attributes;
      this.token = result.access_token;
      const userInfo = result.user;
      this.$state = {
        ...this.$state,
        user_id: userInfo.id,
        username: userInfo.username,
        avatar: userInfo.avatar,
        email: userInfo.email,
        biography: userInfo.biography,
        rememberMe: signForm.rememberMe,
        role: userInfo.role,
        refresh_token: userInfo.refresh_token ? (userInfo.refresh_token as string) : '',
      };
      const cartStore = useCartStore();
      cartStore.getCarts(true);
      if (/^\/account/.test(router.currentRoute.value.path)) {
        await router.push('/');
      }
      this.closeSignIn();
    },

    async signOut(): Promise<void> {
      const cartStore = useCartStore();
      router.push('/');
      this.$reset();
      cartStore.$reset();
      //clear data for pinia persist plugin
      window.localStorage.clear();
      window.sessionStorage.clear();
    },

    async refreshToken(): Promise<void> {
      const result = (await userRefreshToken(this.refresh_token)).data.attributes;
      this.token = result.access_token;
    },

    popSignIn(): void {
      this.signBoxStatus = true;
    },

    closeSignIn(): void {
      this.signBoxStatus = false;
    },

    async changePassword(passwordChangeForm: PasswordChangeForm): Promise<void> {
      const changePasswordData: Partial<UserProfile> = {
        password: passwordChangeForm.password,
        oldPassword: passwordChangeForm.oldPassword,
      };
      await updateUser(changePasswordData);
      this.signOut();
    },

    async googleSign(credential: string) {
      const test = await googleSignIn(credential);
      const result: GoogleSignRes = (await googleSignIn(credential)).data.attributes;
      if (!result.ifExists) {
        await router.push('/account/register');
        ElMessage.warning('Please register first, your google account will then be linked later');
      } else {
        this.token = result.access_token as string;
        const userInfo = result.user as UserInfo;
        this.$state = {
          ...this.$state,
          user_id: userInfo.id,
          username: userInfo.username,
          avatar: userInfo.avatar,
          email: userInfo.email,
          biography: userInfo.biography,
          rememberMe: false,
          role: userInfo.role,
          refresh_token: userInfo.refresh_token ? (userInfo.refresh_token as string) : '',
        };
        const cartStore = useCartStore();
        cartStore.getCarts(true);
        if (/^\/account/.test(router.currentRoute.value.path)) {
          await router.push('/');
        }
        this.closeSignIn();
      }
    },
  },
});
