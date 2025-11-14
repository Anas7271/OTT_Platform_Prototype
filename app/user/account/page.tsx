'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function AccountPage() {
  const { user, loading, updateUser } = useAuth();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'user')) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const handlePlanChange = async (newPlan: string) => {
    if (isUpdating || !user) return;

    setIsUpdating(true);
    setMessage('');

    try {
      // Make API call to update subscription in database
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch('/api/user/subscription', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subscriptionPlan: newPlan })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update subscription');
      }

      const data = await response.json();

      // Update user in auth context with the latest data from server
      const updatedUser = { ...user, subscriptionPlan: newPlan };
      updateUser(updatedUser);

      // Update localStorage to maintain consistency
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setMessage(data.message || `Successfully changed to ${newPlan === 'default' ? 'Free' : newPlan === 'lite' ? 'Lite' : 'Premium'} plan!`);

      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);

    } catch (error: any) {
      console.error('Subscription update error:', error);
      setMessage(error.message || 'Failed to update subscription plan. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: '#fca5a5' }}>Access Denied</h1>
          <p style={{ color: 'var(--foreground)', opacity: 0.8 }}>You need to be logged in as a user to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>Account Management</h1>
          <Link href="/user/feed" className="btn btn-secondary">
            Back to Feed
          </Link>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg text-center ${
            message.includes('Successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`} style={{
            backgroundColor: message.includes('Successfully') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: message.includes('Successfully') ? '#86efac' : '#fca5a5'
          }}>
            {message}
          </div>
        )}

        <div className="card mb-8">
          <div className="card-header">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Profile Information</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium" style={{ color: 'var(--foreground)', opacity: 0.7 }}>Username</h3>
                <p className="text-lg" style={{ color: 'var(--foreground)' }}>{user?.username}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium" style={{ color: 'var(--foreground)', opacity: 0.7 }}>Email</h3>
                <p className="text-lg" style={{ color: 'var(--foreground)' }}>{user?.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium" style={{ color: 'var(--foreground)', opacity: 0.7 }}>Current Plan</h3>
                <p className="text-lg capitalize font-semibold" style={{ color: 'var(--foreground)' }}>
                  {user?.subscriptionPlan}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Subscription Plans</h2>
            <p style={{ color: 'var(--foreground)', opacity: 0.8 }}>Choose the plan that best fits your needs</p>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Free Plan */}
              <div className={`border rounded-lg p-6 ${user?.subscriptionPlan === 'default' ? 'border-green-500' : 'border-gray-300'}`} style={{ borderColor: user?.subscriptionPlan === 'default' ? 'var(--success)' : 'var(--card-border)' }}>
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Free</h3>
                  <p className="text-2xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>₹0/month</p>
                  <ul className="text-sm space-y-2 text-left" style={{ color: 'var(--foreground)', opacity: 0.8 }}>
                    <li>✓ Access to free content</li>
                    <li>✓ Basic browsing</li>
                    <li>✗ No premium content</li>
                    <li>✗ No lite content</li>
                  </ul>
                  {user?.subscriptionPlan === 'default' ? (
                    <span className="inline-block mt-4 px-4 py-2 rounded text-sm font-medium" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#86efac' }}>
                      Current Plan
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePlanChange('default')}
                      className="btn btn-secondary mt-4 w-full"
                      disabled={user?.subscriptionPlan === 'default' || isUpdating}
                    >
                      {isUpdating ? 'Updating...' : 'Downgrade'}
                    </button>
                  )}
                </div>
              </div>

              {/* Lite Plan */}
              <div className={`border rounded-lg p-6 ${user?.subscriptionPlan === 'lite' ? 'border-blue-500' : 'border-gray-300'}`} style={{ borderColor: user?.subscriptionPlan === 'lite' ? '#60a5fa' : 'var(--card-border)' }}>
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Lite</h3>
                  <p className="text-2xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>₹299/month</p>
                  <ul className="text-sm space-y-2 text-left" style={{ color: 'var(--foreground)', opacity: 0.8 }}>
                    <li>✓ Everything in Free</li>
                    <li>✓ Access to lite content</li>
                    <li>✓ Better streaming quality</li>
                    <li>✗ No premium content</li>
                  </ul>
                  {user?.subscriptionPlan === 'lite' ? (
                    <span className="inline-block mt-4 px-4 py-2 rounded text-sm font-medium" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#93c5fd' }}>
                      Current Plan
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePlanChange('lite')}
                      className="btn btn-primary mt-4 w-full"
                      disabled={user?.subscriptionPlan === 'lite' || isUpdating}
                    >
                      {isUpdating ? 'Updating...' : (user?.subscriptionPlan === 'premium' ? 'Downgrade' : 'Upgrade')}
                    </button>
                  )}
                </div>
              </div>

              {/* Premium Plan */}
              <div className={`border rounded-lg p-6 ${user?.subscriptionPlan === 'premium' ? 'border-purple-500' : 'border-gray-300'}`} style={{ borderColor: user?.subscriptionPlan === 'premium' ? '#a78bfa' : 'var(--card-border)' }}>
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Premium</h3>
                  <p className="text-2xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>₹599/month</p>
                  <ul className="text-sm space-y-2 text-left" style={{ color: 'var(--foreground)', opacity: 0.8 }}>
                    <li>✓ Everything in Lite</li>
                    <li>✓ Access to all content</li>
                    <li>✓ 4K streaming quality</li>
                    <li>✓ Offline downloads</li>
                  </ul>
                  {user?.subscriptionPlan === 'premium' ? (
                    <span className="inline-block mt-4 px-4 py-2 rounded text-sm font-medium" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5' }}>
                      Current Plan
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePlanChange('premium')}
                      className="btn btn-primary mt-4 w-full"
                      disabled={user?.subscriptionPlan === 'premium' || isUpdating}
                    >
                      {isUpdating ? 'Updating...' : 'Upgrade'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';