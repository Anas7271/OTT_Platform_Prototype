'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If already authenticated, redirect based on role
    if (!loading && user) {
      if (user.role === 'admin') {
        router.replace('/admin/dashboard');
      } else if (user.role === 'user') {
        router.replace('/user/feed');
      }
    }
  }, [user, loading, router]);

  // If loading, show loading state
  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading...</h2>
        </div>
      </main>
    );
  }

  // If authenticated and redirected, show loading until redirect completes
  if (user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Redirecting...</h2>
        </div>
      </main>
    );
  }

  // Show landing page for unauthenticated users
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24" style={{ backgroundColor: 'var(--background)' }}>
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none" style={{ background: 'linear-gradient(to top, var(--background), var(--background))' }}>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>OTT Platform Prototype</h1>
            <p className="text-lg mb-8" style={{ color: 'var(--foreground)', opacity: 0.8 }}>A minimal OTT platform for college project</p>
            <div className="space-x-4">
              <Link href="/auth/login" className="btn btn-primary">
                Login
              </Link>
              <Link href="/auth/register" className="btn btn-secondary">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}