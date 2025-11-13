'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function UserFeed() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p>Loading content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold">Welcome, {user?.username}!</h2>
          <p className="text-gray-600 mt-1">
            Your subscription: <span className="font-semibold capitalize">{user?.subscriptionPlan}</span>
          </p>
        </div>
        <div className="card-body">
          <p className="text-gray-600">Content feed functionality will be implemented here.</p>
        </div>
      </div>

      <div className="text-center py-4">
        <a href="/user/account" className="btn btn-secondary">
          Manage Account
        </a>
      </div>
    </div>
  );
}