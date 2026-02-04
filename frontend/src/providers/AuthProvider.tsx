'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { signIn as authSignIn, signUp as authSignUp, signOut as authSignOut, getSession } from '@/lib/auth';

interface AuthContextType {
  user: any;
  session: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>; // Removed name parameter since backend doesn't support it
  signOut: () => Promise<void>;
  getCurrentUserId: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on initial load using custom auth session
    const checkAuthStatus = async () => {
      try {
        const sessionResult = await getSession();
        if (sessionResult.data?.user) {
          // User is authenticated
          setIsAuthenticated(true);
          setUser(sessionResult.data.user);
          setUserId(sessionResult.data.user.id?.toString() || null);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authSignIn.email({
        email,
        password,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Login failed');
      }

      // Update state with the session data
      setIsAuthenticated(true);
      setUser(result.data?.user || null);
      setUserId(result.data?.user?.id?.toString() || null);

      return result;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // Note: The backend doesn't currently accept a name field
      const result = await authSignUp.email({
        email,
        password,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Sign up failed');
      }

      // Assuming successful signup means user is logged in
      setIsAuthenticated(true);
      setUser(result.data?.user || { email, id: result.data?.user?.id });
      setUserId(result.data?.user?.id?.toString() || null);
      return result;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    await authSignOut();
    setUser(null);
    setUserId(null);
    setIsAuthenticated(false);
  };

  const getCurrentUserId = async (): Promise<string | null> => {
    if (userId) {
      return userId;
    }

    // If userId is not in state, try to get it from the session
    try {
      const sessionResult = await getSession();
      if (sessionResult.data?.user?.id) {
        const idString = sessionResult.data.user.id.toString();
        setUserId(idString); // Update state for future use
        return idString;
      }
    } catch (error) {
      console.error('Error getting user ID from session:', error);
    }

    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session: isAuthenticated ? { isAuthenticated: true } : { isAuthenticated: false },
        isAuthenticated,
        isLoading,
        userId,
        signIn,
        signUp,
        signOut,
        getCurrentUserId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};