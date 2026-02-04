import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getJwtToken } from '@/lib/auth-client';

export const useUserId = () => {
  const { session, userId: sessionUserId, isLoading } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserId = async () => {
      setLoading(true);

      // First try to get user ID from session
      if (sessionUserId) {
        setUserId(sessionUserId);
        setLoading(false);
        return;
      }

      // If not in session, try to get from JWT token
      if (session?.user?.id) {
        setUserId(session.user.id);
        setLoading(false);
        return;
      }

      // If still no user ID, try to extract from JWT payload directly
      try {
        const token = await getJwtToken();
        if (token) {
          // Decode JWT to extract user ID
          const tokenPayload = token.split('.')[1];
          if (tokenPayload) {
            const decodedPayload = JSON.parse(atob(tokenPayload));
            const extractedUserId = decodedPayload.sub || decodedPayload.userId || null;
            setUserId(extractedUserId);
          }
        }
      } catch (error) {
        console.error('Error extracting user ID from token:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
  }, [session, sessionUserId]);

  return {
    userId,
    loading: loading || isLoading,
    error: !loading && !userId && !isLoading ? new Error('User not authenticated') : null
  };
};