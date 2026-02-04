// Import JWT token handling for our custom auth system
import { getJwtToken } from './auth-client';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number>;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = BASE_URL;
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number>): string {
    let url = `${this.baseUrl}${endpoint}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      url += `?${searchParams.toString()}`;
    }

    return url;
  }

  private async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = 'GET', headers = {}, body, params } = options;

    const url = this.buildUrl(endpoint, params);

    // Get the JWT token for authentication
    const token = getJwtToken();

    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }), // Add Bearer token if available
        ...headers,
      },
      credentials: 'include', // Include cookies for authentication
      ...(body && { body: typeof body === 'string' ? body : JSON.stringify(body) }),
    };

    try {
      const response = await fetch(url, config);

      // Read the response body once at the beginning to avoid "body stream already read" error
      let responseBodyText = '';
      let responseClone = response.clone(); // Clone the response to allow multiple reads

      if (response.bodyUsed) {
        // If the body has already been read elsewhere, use the original response
        responseBodyText = await response.text();
      } else {
        // Otherwise, clone the response and read the cloned version
        responseBodyText = await responseClone.text();
      }

      // Handle different response statuses
      if (!response.ok) {
        let errorBody;
        try {
          // Parse the error body that we already read
          errorBody = JSON.parse(responseBodyText);
        } catch {
          // If not valid JSON, use the raw text
          errorBody = { message: responseBodyText || response.statusText };
        }

        // Handle specific status codes with appropriate messages
        if (response.status === 401) {
          // Redirect to login on 401
          console.warn('Unauthorized access - redirecting to login');
          // window.location.href = '/login'; // Uncomment when login is implemented
        } else if (response.status === 403) {
          throw new Error('Access denied: You do not have permission to perform this action');
        } else if (response.status === 404) {
          throw new Error('Resource not found');
        } else {
          throw new Error(`${errorBody.detail || errorBody.message || response.statusText}`);
        }
      }

      // Handle empty response
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return undefined as T;
      }

      // Parse the response body we already read
      try {
        return JSON.parse(responseBodyText);
      } catch (e) {
        // If response is not JSON, return as text
        return responseBodyText as unknown as T;
      }
    } catch (error) {
      console.error(`API request failed: ${method} ${url}`, error);
      throw error;
    }
  }

  // Generic methods
  get<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  post<T>(endpoint: string, body?: any, params?: Record<string, string | number>): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, params });
  }

  put<T>(endpoint: string, body?: any, params?: Record<string, string | number>): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body, params });
  }

  // Add the missing patch method
  patch<T>(endpoint: string, body?: any, params?: Record<string, string | number>): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body, params });
  }

  delete<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', params });
  }
}

export const apiClient = new ApiClient();

export default apiClient;