'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function ContentDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'user')) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading content...</h2>
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
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="btn btn-secondary"
          >
            ← Back to Feed
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <h1 className="text-3xl font-bold">Content Detail</h1>
            <p className="text-gray-600 mt-1">This page is under construction</p>
          </div>
          <div className="card-body">
            <div className="text-center py-8">
              <p className="text-gray-600">Content ID: {params.id}</p>
              <p className="text-gray-600">Content details will be displayed here.</p>
              <Link href="/user/feed" className="btn btn-primary mt-4">
                Browse Feed
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}