'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { useUser } from '@/contexts/user-context';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { login } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Attempt to login using custom auth API
      const response = await signIn.email({
        email,
        password,
      });

      if (response.error) {
        throw new Error(response.error.message || 'Invalid credentials');
      }

      if (!response.data) {
        throw new Error('No response data received');
      }

      // Update user context with the response data
      const userObj = {
        id: response.data.user.id.toString(),
        email: response.data.user.email,
        createdAt: response.data.user.created_at // Using the field from backend
      };

      // Update user context
      login(userObj);

      // Redirect to dashboard
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[hsl(190,92%,65%)] to-[hsl(160,80%,64%)] bg-clip-text text-transparent">
            GlassFlow Todo
          </h1>
          <h2 className="mt-2 text-xl font-semibold text-[hsl(0,0%,98.5%)]">Welcome Back</h2>
          <p className="mt-2 text-[hsl(0,0%,72%)]">Sign in to your premium task management experience</p>
        </div>

        {error && (
          <div className="bg-[hsl(346,85%,64%,0.2)] border border-[hsl(346,85%,64%,0.3)] rounded-lg p-3 text-[hsl(346,85%,64%)] text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[hsl(0,0%,98.5%)] mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                "w-full px-4 py-3 rounded-xl glass-button text-[hsl(0,0%,98.5%)] placeholder-[hsl(0,0%,72%)]",
                "focus:outline-none focus:ring-2 focus:ring-[hsl(190,92%,65%)]"
              )}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[hsl(0,0%,98.5%)] mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  "w-full px-4 py-3 rounded-xl glass-button text-[hsl(0,0%,98.5%)] placeholder-[hsl(0,0%,72%)] pr-12",
                  "focus:outline-none focus:ring-2 focus:ring-[hsl(190,92%,65%)]"
                )}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-[hsl(0,0%,72%)]" />
                ) : (
                  <Eye className="h-5 w-5 text-[hsl(0,0%,72%)]" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[hsl(190,92%,65%)] focus:ring-[hsl(190,92%,65%)] rounded border-[hsl(120,190,255,0.18)] bg-[hsl(25,30,70,0.17)]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-[hsl(0,0%,72%)]">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="text-[hsl(190,92%,65%)] hover:underline">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full py-3 px-4 rounded-xl font-medium text-[hsl(0,0%,98.5%)] transition-all duration-300",
              "bg-gradient-to-r from-[hsl(190,92%,65%)] to-[hsl(160,80%,64%)] hover:opacity-90",
              "focus:outline-none focus:ring-2 focus:ring-[hsl(190,92%,65%)] focus:ring-offset-2",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-sm text-[hsl(0,0%,72%)]">
          Don't have an account?{' '}
          <Link href="/signup" className="text-[hsl(190,92%,65%)] hover:underline font-medium">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}