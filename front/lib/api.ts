import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3000/api'; 


export type ApiResponse<T = any> = 
  | { success: true; data: T; message?: string }
  | { success: false; error: string; message?: string };

export function isErrorResponse<T>(response: ApiResponse<T>): response is { success: false; error: string; message?: string } {
  return !response.success;
}

class ApiService {
  private authToken: string | null = null;

  constructor() {
    this.authToken = null;
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  private async getHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const error = await response.text();
      return { success: false, error };
    }
    
    try {
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to parse response' };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: await this.getHeaders(),
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(body),
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: await this.getHeaders(),
        body: JSON.stringify(body),
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: await this.getHeaders(),
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }
}

export const apiService = new ApiService();