'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import ContentUploadForm from '@/components/admin/ContentUploadForm';

export default function AdminUploadPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/auth/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p style={{ color: 'var(--foreground)', opacity: 0.8 }}>You don&apos;t have permission to access this page.</p>
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