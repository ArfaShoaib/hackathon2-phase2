'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/user-context';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Zap, Shield } from 'lucide-react';
import { ClientOnly } from '@/components/common/client-only-wrapper';

export default function Home() {
  return (
    <ClientOnly>
      <HomeContent />
    </ClientOnly>
  );
}

function HomeContent() {
  const router = useRouter();
  const { user, loading } = useUser();

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05040f] relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0a061a] via-[#05040f] to-[#0a061a]"></div>
        <div className="relative z-10 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(190,92%,65%)] mb-4"></div>
          <p className="text-[hsl(0,0%,98.5%)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05040f] relative">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0a061a] via-[#05040f] to-[#0a061a]"></div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-[hsl(120,190,255,0.1)] bg-[#05040f] bg-opacity-80 backdrop-blur-22px">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-[hsl(190,92%,65%)] to-[hsl(160,80%,64%)] w-8 h-8 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[hsl(190,92%,65%)] to-[hsl(160,80%,64%)] bg-clip-text text-transparent">
                GlassFlow
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-[hsl(0,0%,98.5%)] hover:text-[hsl(190,92%,65%)] transition-colors">
                Features
              </Link>
              <Link href="#about" className="text-[hsl(0,0%,98.5%)] hover:text-[hsl(190,92%,65%)] transition-colors">
                About
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="outline" className="glass-button text-[hsl(0,0%,98.5%)]">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-[hsl(190,92%,65%)] to-[hsl(160,80%,64%)] hover:opacity-90 text-[hsl(0,0%,98.5%)]">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-[hsl(190,92%,65%)] via-[hsl(160,80%,64%)] to-[hsl(38,92%,65%)] bg-clip-text text-transparent">
                  Premium Task Management
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-[hsl(0,0%,72%)] mb-8 max-w-2xl mx-auto">
                Experience the future of productivity with our glassmorphism design and intuitive task management features.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-[hsl(190,92%,65%)] to-[hsl(160,80%,64%)] hover:opacity-90 text-[hsl(0,0%,98.5%)] px-8 py-6 text-lg">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="glass-button text-[hsl(0,0%,98.5%)] px-8 py-6 text-lg">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-[hsl(190,92%,65%)] to-[hsl(160,80%,64%)] bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass-card p-6 text-center">
                <div className="w-12 h-12 bg-[hsl(190,92%,65%,0.2)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-[hsl(190,92%,65%)]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[hsl(0,0%,98.5%)]">Lightning Fast</h3>
                <p className="text-[hsl(0,0%,72%)]">Experience blazing fast performance with our optimized interface.</p>
              </div>

              <div className="glass-card p-6 text-center">
                <div className="w-12 h-12 bg-[hsl(160,80%,64%,0.2)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-[hsl(160,80%,64%)]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[hsl(0,0%,98.5%)]">Secure & Private</h3>
                <p className="text-[hsl(0,0%,72%)]">Your data is protected with enterprise-grade security measures.</p>
              </div>

              <div className="glass-card p-6 text-center">
                <div className="w-12 h-12 bg-[hsl(38,92%,65%,0.2)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-[hsl(38,92%,65%)]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[hsl(0,0%,98.5%)]">Intuitive Design</h3>
                <p className="text-[hsl(0,0%,72%)]">Beautiful glassmorphism interface that makes task management delightful.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass-card p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[hsl(0,0%,98.5%)]">
                Ready to Transform Your Productivity?
              </h2>
              <p className="text-xl text-[hsl(0,0%,72%)] mb-8">
                Join thousands of users who have already upgraded their task management experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-[hsl(190,92%,65%)] to-[hsl(160,80%,64%)] hover:opacity-90 text-[hsl(0,0%,98.5%)] px-8 py-6 text-lg">
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="glass-button text-[hsl(0,0%,98.5%)] px-8 py-6 text-lg">
                    Sign In to Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[hsl(120,190,255,0.1)] bg-[#05040f] bg-opacity-80 backdrop-blur-22px">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-r from-[hsl(190,92%,65%)] to-[hsl(160,80%,64%)] w-8 h-8 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">G</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-[hsl(190,92%,65%)] to-[hsl(160,80%,64%)] bg-clip-text text-transparent">
                  GlassFlow
                </span>
              </div>
              <p className="text-[hsl(0,0%,72%)]">
                Premium task management with beautiful glassmorphism design.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-[hsl(0,0%,98.5%)]">Product</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-[hsl(0,0%,72%)] hover:text-[hsl(190,92%,65%)] transition-colors">Features</Link></li>
                <li><Link href="#" className="text-[hsl(0,0%,72%)] hover:text-[hsl(190,92%,65%)] transition-colors">Pricing</Link></li>
                <li><Link href="#" className="text-[hsl(0,0%,72%)] hover:text-[hsl(190,92%,65%)] transition-colors">Integrations</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-[hsl(0,0%,98.5%)]">Company</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-[hsl(0,0%,72%)] hover:text-[hsl(190,92%,65%)] transition-colors">About</Link></li>
                <li><Link href="#" className="text-[hsl(0,0%,72%)] hover:text-[hsl(190,92%,65%)] transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-[hsl(0,0%,72%)] hover:text-[hsl(190,92%,65%)] transition-colors">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-[hsl(0,0%,98.5%)]">Support</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-[hsl(0,0%,72%)] hover:text-[hsl(190,92%,65%)] transition-colors">Help Center</Link></li>
                <li><Link href="#" className="text-[hsl(0,0%,72%)] hover:text-[hsl(190,92%,65%)] transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="text-[hsl(0,0%,72%)] hover:text-[hsl(190,92%,65%)] transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[hsl(120,190,255,0.1)] mt-8 pt-8 text-center">
            <p className="text-[hsl(0,0%,72%)]">
              © 2026 GlassFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}