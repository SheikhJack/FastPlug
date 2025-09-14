import { apiService, isErrorResponse } from './api'
import { Product } from './types/product'


export interface ProductsResponse {
  products: Product[]
}

export const productApi = {
  getProducts: async () => {
    const response = await apiService.get<ProductsResponse>('/products')
    
    if (isErrorResponse(response)) {
      return { success: false, error: response.error }
    }
    
    return { success: true, data: response.data }
  },

  getFeaturedProducts: async () => {
    const response = await apiService.get<ProductsResponse>('/products?featured=true')
    
    if (isErrorResponse(response)) {
      return { success: false, error: response.error }
    }
    
    return { success: true, data: response.data }
  },

  getProduct: async (id: string) => {
    const response = await apiService.get<{ product: Product }>(`/products/${id}`)
    
    if (isErrorResponse(response)) {
      return { success: false, error: response.error }
    }
    
    return { success: true, data: response.data }
  }
}