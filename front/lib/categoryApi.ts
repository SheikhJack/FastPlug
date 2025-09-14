import { apiService, isErrorResponse } from './api'
import { Category } from './types/category'

export interface CategoriesResponse {
  categories: Category[]
}

export const categoryApi = {
  getCategories: async () => {
    const response = await apiService.get<CategoriesResponse>('/categories')
    
    if (isErrorResponse(response)) {
      return { success: false, error: response.error }
    }
    
    return { success: true, data: response.data }
  },

  getCategory: async (id: string) => {
    const response = await apiService.get<{ category: Category }>(`/categories/${id}`)
    
    if (isErrorResponse(response)) {
      return { success: false, error: response.error }
    }
    
    return { success: true, data: response.data }
  }
}