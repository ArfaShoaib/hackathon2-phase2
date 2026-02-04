// Custom auth API functions to work with the backend's custom auth system
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Define types that match the backend
interface User {
  id: number;
  email: string;
  created_at: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

interface SignUpData {
  email: string;
  password: string;
  name?: string;
}

interface SignInData {
  email: string;
  password: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
  };
}

// SignUp function that calls the backend's custom API
export const signUp = {
  email: async (data: SignUpData): Promise<ApiResponse<TokenResponse>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          error: {
            message: errorData.detail || `HTTP error! status: ${response.status}`,
          },
        };
      }

      const result: TokenResponse = await response.json();
      // Store the token in localStorage for use in API calls
      localStorage.setItem('access_token', result.access_token);

      return { data: result };
    } catch (error: any) {
      return {
        error: {
          message: error.message || 'Network error occurred',
        },
      };
    }
  },
};

// SignIn function that calls the backend's custom API
export const signIn = {
  email: async (data: SignInData): Promise<ApiResponse<TokenResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error: {
          message: errorData.detail || `HTTP error! status: ${response.status}`,
        },
      };
    }

    const result: TokenResponse = await response.json();
    // Store the token in localStorage for use in API calls
    localStorage.setItem('access_token', result.access_token);

    return { data: result };
  } catch (error: any) {
    return {
      error: {
        message: error.message || 'Network error occurred',
      },
    };
  }
},
};

// SignOut function
export const signOut = async (): Promise<void> => {
  localStorage.removeItem('access_token');
};

// Get session function
export const getSession = async (): Promise<{ data?: { user: User } } | { error: { message: string } }> => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return { error: { message: 'No active session' } };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/get-session`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('access_token');
      }
      const errorData = await response.json().catch(() => ({}));
      return {
        error: {
          message: errorData.detail || `HTTP error! status: ${response.status}`,
        },
      };
    }

    const userData = await response.json();
    return { data: { user: userData } };
  } catch (error: any) {
    return {
      error: {
        message: error.message || 'Network error occurred',
      },
    };
  }
};

// Helper function to check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const session = await getSession();
    return !!session?.data?.user;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};

// Helper function to get user session
export const getUserSession = async () => {
  try {
    const session = await getSession();
    return session?.data;
  } catch (error) {
    console.error("Error getting user session:", error);
    return null;
  }
};

// Export useSession hook-like function
export const useSession = () => {
  // This would typically be implemented as a React hook
  // For now, returning basic functions
  return {
    getSession,
    isAuthenticated,
  };
};