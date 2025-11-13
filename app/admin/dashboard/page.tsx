'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function AdminDashboard() {
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>Admin Dashboard</h1>
            <p style={{ color: 'var(--foreground)', opacity: 0.8 }}>Welcome, {user.username}!</p>
          </div>
          <button onClick={logout} className="btn btn-danger">
            Logout
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Content Management</h2>
            <p style={{ color: 'var(--foreground)', opacity: 0.8 }}>Upload and manage platform content</p>
          </div>
          <div className="card-body">
            <div className="text-center py-8">
              <div className="space-y-4">
                <div className="p-6 border rounded-lg" style={{ borderColor: 'var(--card-border)' }}>
                  <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--foreground)' }}>Content Upload</h3>
                  <p style={{ color: 'var(--foreground)', opacity: 0.8 }}>Upload new content with thumbnails, titles, descriptions, and access levels</p>
                  <div className="mt-4">
                    <a href="/admin/upload" className="btn btn-primary">
                      Upload Content
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}