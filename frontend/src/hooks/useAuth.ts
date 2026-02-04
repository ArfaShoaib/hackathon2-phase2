// This hook now imports from our custom AuthProvider
import { getJwtToken } from '@/lib/auth-client';
// Re-export the useAuth hook from our AuthProvider
export { useAuth } from '@/providers/AuthProvider';