'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function UserFeedPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'user')) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Loading...</h2>
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>Welcome, {user.username}!</h1>
          <p className="mt-1" style={{ color: 'var(--foreground)', opacity: 0.8 }}>
            Your subscription: <span className="font-semibold capitalize">{user.subscriptionPlan}</span>
          </p>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Content Feed</h2>
            <p style={{ color: 'var(--foreground)', opacity: 0.8 }}>Browse and discover content</p>
          </div>
          <div className="card-body">
            <div className="text-center py-8">
              <p className="mb-4" style={{ color: 'var(--foreground)', opacity: 0.8 }}>Content feed is coming soon...</p>
              <p className="text-sm" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
                This will display available content based on your subscription level.
              </p>
              <div className="mt-6 space-x-4">
                <a href="/user/account" className="btn btn-secondary">
                  Manage Account
                </a>
                <button onClick={() => {logout(); router.push('/auth/login');}} className="btn btn-danger">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}