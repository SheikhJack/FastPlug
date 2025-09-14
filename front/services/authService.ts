import { authApi, LoginParams, User } from '@/lib/authApi';
import { ApiResponse, isErrorResponse } from '@/lib/api';
import { Alert } from 'react-native';



export const authService = {

  login: async (params: LoginParams): Promise<{ success: boolean; data?: User; error?: string }> => {
    try {
      const response = await authApi.login(params);
      
      if (isErrorResponse(response)) {
        return { success: false, error: response.error };
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  },

  register: async (userData: any): Promise<{ success: boolean; data?: User; error?: string }> => {
    try {
      const response = await authApi.createUser(userData);
      
      if (isErrorResponse(response)) {
        return { success: false, error: response.error };
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  forgotPassword: async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authApi.forgotPassword(email);
      
      if (isErrorResponse(response)) {
        return { success: false, error: response.error };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Password reset failed' };
    }
  },
};