'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const currentUser = useAppStore(state => state.currentUser);
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!currentUser && pathname !== '/login') {
      router.push('/login');
    }
  }, [currentUser, pathname, router, mounted]);

  // Don't render children if not mounted to prevent hydration mismatches
  if (!mounted) return null;

  // If we are on login, or if we have a user, render children
  if (pathname === '/login' || currentUser) {
    return <>{children}</>;
  }

  // Otherwise render nothing while redirecting
  return null;
}
