'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'user')) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'user') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need to be logged in as a user to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Account Management</h1>
          <Link href="/user/feed" className="btn btn-secondary">
            Back to Feed
          </Link>
        </div>

        <div className="card mb-8">
          <div className="card-header">
            <h2 className="text-xl font-semibold">Profile Information</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Username</h3>
                <p className="text-lg">{user?.username}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="text-lg">{user?.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Current Plan</h3>
                <p className="text-lg capitalize font-semibold">
                  {user?.subscriptionPlan}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold">Subscription Plans</h2>
            <p className="text-gray-600">Choose the plan that best fits your needs</p>
          </div>
          <div className="card-body">
            <p className="text-center text-gray-600">Account management features coming soon...</p>
            <div className="text-center mt-4">
              <Link href="/user/feed" className="btn btn-primary">
                Browse Content
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}