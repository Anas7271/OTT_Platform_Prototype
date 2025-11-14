'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import ContentUploadForm from '@/components/admin/ContentUploadForm';

export default function AdminUploadPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      console.log('Redirecting to login - user:', user, 'role:', user?.role);
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

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p style={{ color: 'var(--foreground)', opacity: 0.8 }}>You don&apos;t have permission to access this page.</p>
          <p style={{ color: 'var(--foreground)', opacity: 0.6 }}>User: {user ? JSON.stringify(user) : 'No user'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>Content Upload</h1>
              <p style={{ color: 'var(--foreground)', opacity: 0.8 }}>Upload new content to the platform</p>
            </div>
            <div className="space-x-4">
              <a href="/admin/dashboard" className="btn btn-secondary">
                Back to Dashboard
              </a>
              <button onClick={logout} className="btn btn-danger">
                Logout
              </button>
            </div>
          </div>
        </div>

        <ContentUploadForm />
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';