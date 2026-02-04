'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from './ui/spinner';


interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback = (
    <div className="flex justify-center items-center h-screen">
      <Spinner />
    </div>
  )
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Redirect to login page
        router.push('/auth/login'); // Adjust the login path as needed
      } else {
        setHasCheckedAuth(true);
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Show fallback while checking auth status or if not authenticated
  if (isLoading || !hasCheckedAuth) {
    return fallback;
  }

  // Render children if authenticated
  return <>{children}</>;
};