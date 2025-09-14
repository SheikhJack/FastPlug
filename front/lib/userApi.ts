import { apiService } from './api';

export interface Profile {
  _id: string;
  name: string;
  phone: string;
  email: string;
  notificationToken: string;
  is_Active: boolean;
  addresses: any[];
  whishlist: any[];
}

export const userApi = {
  getProfile: async () => {
    return apiService.get<Profile>('/user/profile');
  },

  updateProfile: async (updateData: { name: string; phone: string; is_Active: boolean }) => {
    return apiService.put<Profile>('/user/profile', updateData);
  },

  updateAddress: async (addressData: any) => {
    return apiService.put('/user/address', addressData);
  },

  deleteAddress: async (id: string) => {
    return apiService.delete(`/user/address/${id}`);
  },
   addToWishlist: async (productId: string) => {
    return apiService.post<{ success: boolean }>('/user/wishlist/add', { productId });
  },

  removeFromWishlist: async (productId: string) => {
    return apiService.post<{ success: boolean }>('/user/wishlist/remove', { productId });
  },
};