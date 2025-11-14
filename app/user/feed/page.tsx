'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ContentFeed from '@/components/user/ContentFeed';

export default function UserFeedPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('UserFeed useEffect:', { loading, user: user ? { id: user._id, role: user.role, username: user.username } : 'No user' });

    if (!loading && (!user || user.role !== 'user')) {
      console.log('Redirecting to login from user feed:', { loading, hasUser: !!user, role: user?.role });
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Loading...</h2>
          <p className="mt-2" style={{ color: 'var(--foreground)', opacity: 0.8 }}>
            User: {user ? `${user.username} (${user.role})` : 'None'}
          </p>
          <details className="mt-4 text-left">
            <summary style={{ color: 'var(--foreground)', opacity: 0.8, cursor: 'pointer' }}>Debug Info</summary>
            <pre className="text-xs mt-2 p-2 rounded" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--foreground)' }}>
              Token in localStorage: {localStorage.getItem('token') ? 'Exists' : 'Missing'}
              User in localStorage: {localStorage.getItem('user') ? 'Exists' : 'Missing'}
              Storage keys: {Object.keys(localStorage).join(', ')}
            </pre>
          </details>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'user') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p style={{ color: 'var(--foreground)', opacity: 0.7 }}>You need to be logged in as a user to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>Welcome, {user.username}!</h1>
            <p className="mt-1" style={{ color: 'var(--foreground)', opacity: 0.8 }}>
              Your subscription: <span className="font-semibold capitalize">{user.subscriptionPlan}</span>
            </p>
          </div>
          <div className="space-x-4">
            <a href="/user/account" className="btn btn-secondary">
              Manage Account
            </a>
            <button onClick={() => {logout(); router.push('/auth/login');}} className="btn btn-danger">
              Logout
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Content Feed</h2>
          <p style={{ color: 'var(--foreground)', opacity: 0.8 }}>Browse and discover content based on your subscription</p>
        </div>

        <ContentFeed />
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';