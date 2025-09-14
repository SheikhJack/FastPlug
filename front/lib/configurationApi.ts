import { apiService } from './api';

export interface Configuration {
  _id: string;
  currency: string;
  currencySymbol: string;
  deliveryCharges: number;
  error: string;
  
}

export const configurationApi = {
  getConfiguration: async () => {
    return apiService.get<Configuration>('/configuration');
  },
};