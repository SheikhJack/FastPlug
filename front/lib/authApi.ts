import { apiService } from './api';

export interface LoginParams {
  facebookId?: string;
  email?: string;
  password?: string;
  type: string;
  appleId?: string;
  name?: string;
  notificationToken?: string | null;
}

export interface User {
  userId: string;
  token: string;
  tokenExpiration: string;
  name: string;
  email: string;
  phone: string;
  is_Active: boolean;
}

export const authApi = {
  login: async (params: LoginParams) => {
    return apiService.post<User>('/login', params);
  },

  createUser: async (userData: any) => {
    return apiService.post<User>('/register', userData);
  },

  logout: async () => {
    return apiService.post('/logout', {});
  },

  forgotPassword: async (email: string) => {
    return apiService.post('/forgot-password', { email });
  },
};