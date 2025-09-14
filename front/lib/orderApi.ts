import { apiService } from './api';
import { Order } from './types/user';

export interface OrderResponse {
  orders: Order[];
}

export const orderApi = {
  getOrders: async (offset?: number) => {
    const endpoint = offset ? `/orders?offset=${offset}` : '/orders';
    return apiService.get<OrderResponse>(endpoint); // Add the generic type here
  },

  placeOrder: async (orderData: any) => {
    return apiService.post<{ order: Order }>('/orders', orderData); // Example with response type
  },

  getOrder: async (id: string) => {
    return apiService.get<{ order: Order }>(`/orders/${id}`); // Example with response type
  },
};