'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/lib/api';
import { getUserSession, signOut as authSignOut } from '@/lib/auth';

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  // Initialize loading to true on client-side to prevent hydration mismatch
  const [loading, setLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      // Client-side: start with loading state to match server
      return true;
    }
    // Server-side: always return true
    return true;
  });

  // Check for user session on initial load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getUserSession();
        if (session?.user) {
          // Map the auth session user to our User type
          const userData: User = {
            id: String(session.user.id || ''),
            email: session.user.email || '',
            createdAt: session.user.created_at ? new Date(session.user.created_at).toISOString() : new Date().toISOString(),
          };
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authSignOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setUser(null);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}