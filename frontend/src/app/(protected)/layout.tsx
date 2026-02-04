'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/user-context';
import { ClientOnly } from '@/components/common/client-only-wrapper';

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ClientOnly>
      <ProtectedLayoutContent>{children}</ProtectedLayoutContent>
    </ClientOnly>
  );
}

function ProtectedLayoutContent({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05040f]">
        <div className="text-[hsl(0,0%,98.5%)]">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#05040f] relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0a061a] via-[#05040f] to-[#0a061a]"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
