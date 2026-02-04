'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth';
import { useUser } from '@/contexts/user-context';
import { Menu, X, Sun, Moon, User, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { user, logout } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[hsl(120,190,255,0.1)] bg-[#05040f] bg-opacity-80 backdrop-blur-22px">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-[hsl(190,92%,65%)] to-[hsl(160,80%,64%)] w-8 h-8 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[hsl(190,92%,65%)] to-[hsl(160,80%,64%)] bg-clip-text text-transparent">
                GlassFlow
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="text-[hsl(0,0%,98.5%)] hover:text-[hsl(190,92%,65%)] transition-colors">
              Dashboard
            </Link>
            <Link href="/tasks" className="text-[hsl(0,0%,98.5%)] hover:text-[hsl(190,92%,65%)] transition-colors">
              Tasks
            </Link>
            <Link href="/settings" className="text-[hsl(0,0%,98.5%)] hover:text-[hsl(190,92%,65%)] transition-colors">
              Settings
            </Link>
          </nav>

          {/* User Avatar and Menu */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full glass-button p-0"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[hsl(190,92%,65%)] to-[hsl(160,80%,64%)] flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </Button>

                {isMenuOpen && (
                  <div className="glass-card absolute right-0 mt-2 w-48 rounded-xl py-2 shadow-lg">
                    <div className="px-4 py-2 border-b border-[hsl(120,190,255,0.1)]">
                      <p className="text-sm font-medium text-[hsl(0,0%,98.5%)]">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <button className="w-full text-left px-4 py-2 text-sm text-[hsl(0,0%,98.5%)] hover:bg-[hsl(25,30,70,0.2)] flex items-center gap-2">
                        <User className="h-4 w-4" /> Profile
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-[hsl(0,0%,98.5%)] hover:bg-[hsl(25,30,70,0.2)] flex items-center gap-2">
                        <Settings className="h-4 w-4" /> Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-[hsl(0,0%,98.5%)] hover:bg-[hsl(346,85%,64%,0.2)] text-[hsl(346,85%,64%)] flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/(auth)/login">
                <Button variant="outline" className="glass-button">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              className="md:hidden glass-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden glass-card rounded-xl my-2 p-4">
            <nav className="flex flex-col space-y-2">
              <Link href="/dashboard" className="text-[hsl(0,0%,98.5%)] hover:text-[hsl(190,92%,65%)] py-2 transition-colors">
                Dashboard
              </Link>
              <Link href="/tasks" className="text-[hsl(0,0%,98.5%)] hover:text-[hsl(190,92%,65%)] py-2 transition-colors">
                Tasks
              </Link>
              <Link href="/settings" className="text-[hsl(0,0%,98.5%)] hover:text-[hsl(190,92%,65%)] py-2 transition-colors">
                Settings
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}