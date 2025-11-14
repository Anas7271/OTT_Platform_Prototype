'use client';

import { useAuth } from '@/lib/auth-context';

export default function AdminTestAuthPage() {
  const { user, token, loading } = useAuth();

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>Admin Auth Test</h1>

        <div className="space-y-4">
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Auth Context State</h2>
            </div>
            <div className="card-body">
              <div className="space-y-2" style={{ color: 'var(--foreground)' }}>
                <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
                <p><strong>Token:</strong> {token ? `First 50 chars: ${token.substring(0, 50)}...` : 'No token'}</p>
                <p><strong>User:</strong> {user ? 'User exists' : 'No user'}</p>
                {user && (
                  <>
                    <p><strong>User ID:</strong> {String(user._id)}</p>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                    <p><strong>Subscription:</strong> {user.subscriptionPlan}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Local Storage</h2>
            </div>
            <div className="card-body">
              <div className="space-y-2" style={{ color: 'var(--foreground)' }}>
                <p><strong>Token in localStorage:</strong> {localStorage.getItem('token') ? 'Yes' : 'No'}</p>
                <p><strong>User in localStorage:</strong> {localStorage.getItem('user') ? 'Yes' : 'No'}</p>
                {localStorage.getItem('user') && (
                  <details>
                    <summary>Raw user data</summary>
                    <pre className="mt-2 p-2 rounded text-xs" style={{ backgroundColor: 'var(--card-bg)' }}>
                      {localStorage.getItem('user')}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Admin Status</h2>
            </div>
            <div className="card-body">
              <p style={{ color: 'var(--foreground)' }}>
                <strong>Can access admin pages:</strong> {' '}
                {!loading && user && user.role === 'admin' ?
                  <span style={{ color: '#86efac' }}>✅ Yes</span> :
                  <span style={{ color: '#fca5a5' }}>❌ No</span>
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';