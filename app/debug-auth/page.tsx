'use client';

import { useAuth } from '@/lib/auth-context';

export default function DebugAuthPage() {
  const { user, token, loading } = useAuth();

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>Debug Authentication</h1>

        <div className="space-y-4">
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Auth Context State</h2>
            </div>
            <div className="card-body">
              <pre className="text-xs" style={{ color: 'var(--foreground)' }}>
                {JSON.stringify({ loading, user, hasToken: !!token }, null, 2)}
              </pre>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Local Storage</h2>
            </div>
            <div className="card-body">
              <p style={{ color: 'var(--foreground)' }}>
                <strong>Token:</strong> {localStorage.getItem('token') ? 'Exists' : 'Missing'}
              </p>
              <p style={{ color: 'var(--foreground)' }}>
                <strong>User:</strong> {localStorage.getItem('user') ? 'Exists' : 'Missing'}
              </p>
              {localStorage.getItem('user') && (
                <pre className="text-xs mt-2" style={{ color: 'var(--foreground)' }}>
                  {JSON.stringify(JSON.parse(localStorage.getItem('user') || '{}'), null, 2)}
                </pre>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Actions</h2>
            </div>
            <div className="card-body space-x-4">
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="btn btn-danger"
              >
                Clear Storage & Reload
              </button>
              <a href="/auth/login" className="btn btn-primary">
                Go to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';