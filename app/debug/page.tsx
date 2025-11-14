'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function DebugPage() {
  const { user, token } = useAuth();
  const [apiResult, setApiResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testToken = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/token', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      setApiResult({
        status: response.status,
        ok: response.ok,
        data: result
      });
    } catch (error: any) {
      setApiResult({
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>Token Debug Page</h1>

        <div className="space-y-6">
          {/* Auth Context Info */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Auth Context State</h2>
            </div>
            <div className="card-body">
              <div className="space-y-2" style={{ color: 'var(--foreground)' }}>
                <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'Not logged in'}</p>
                <p><strong>Token:</strong> {token ? `${token.substring(0, 50)}...` : 'No token'}</p>
              </div>
            </div>
          </div>

          {/* Token Test */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Token Verification Test</h2>
            </div>
            <div className="card-body">
              <button
                onClick={testToken}
                disabled={loading || !token}
                className="btn btn-primary mb-4"
              >
                {loading ? 'Testing...' : 'Test Token'}
              </button>

              {apiResult && (
                <div className="mt-4">
                  <h3 style={{ color: 'var(--foreground)' }}>API Response:</h3>
                  <pre
                    className="mt-2 p-4 rounded bg-gray-100 dark:bg-gray-800 text-xs overflow-auto"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      color: 'var(--foreground)',
                      border: '1px solid var(--card-border)'
                    }}
                  >
                    {JSON.stringify(apiResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';