'use client';

import { useState, useEffect } from 'react';

interface Content {
  _id: string;
  title: string;
  description: string;
  category: string;
  thumbnailPath: string;
  accessLevel: 'everyone' | 'lite' | 'premium';
  createdAt: string;
}

export default function FeedTestPage() {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    // Get token from localStorage directly
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    console.log('Feed test - Token:', !!savedToken);
    console.log('Feed test - User:', savedUser);

    if (savedToken) {
      setToken(savedToken);
      fetchContent(savedToken);
    } else {
      setLoading(false);
      setError('No token found in localStorage');
    }
  }, []);

  const fetchContent = async (authToken: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/content/feed', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch content');
      }

      setContent(data.content || []);
      console.log('Content fetched:', data);
    } catch (error: any) {
      setError(error.message);
      console.error('Content fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDebugContent = async () => {
    try {
      const response = await fetch('/api/content/debug');
      const data = await response.json();
      console.log('Debug content API response:', data);
      return data;
    } catch (error: any) {
      console.error('Debug fetch error:', error);
      return null;
    }
  };

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>Content Feed Test</h1>
          <p className="mt-1" style={{ color: 'var(--foreground)', opacity: 0.8 }}>
            Testing content display without authentication checks
          </p>
        </div>

        <div className="card mb-6">
          <div className="card-header">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Debug Info</h2>
          </div>
          <div className="card-body">
            <div className="mb-4">
              <button
                onClick={fetchDebugContent}
                className="btn btn-secondary mr-2"
              >
                Test Debug API (No Auth)
              </button>
              <button
                onClick={() => token && fetchContent(token)}
                disabled={!token}
                className="btn btn-primary"
              >
                Test Feed API (With Auth)
              </button>
            </div>
            <pre className="text-xs" style={{ color: 'var(--foreground)' }}>
              {JSON.stringify({ loading, error, contentCount: content.length, hasToken: !!token, apiResponse: content.length > 0 ? { contentCount: content.length, firstItem: content[0] } : null }, null, 2)}
            </pre>
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div style={{ color: 'var(--foreground)', opacity: 0.8 }}>Loading content...</div>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div style={{ color: '#fca5a5' }}>Error: {error}</div>
            <button
              onClick={() => token && fetchContent(token)}
              className="btn btn-primary mt-4"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && content.length === 0 && (
          <div className="text-center py-8">
            <div style={{ color: 'var(--foreground)', opacity: 0.8 }}>
              No content available. Admins need to upload content first.
            </div>
          </div>
        )}

        {!loading && !error && content.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((item) => (
              <div key={item._id} className="card">
                <div className="aspect-video bg-gray-200 rounded-t-lg relative overflow-hidden">
                  {item.thumbnailPath ? (
                    <img
                      src={item.thumbnailPath}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <span style={{ color: 'var(--foreground)', opacity: 0.6 }}>No Thumbnail</span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--foreground)' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm mb-3" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
                    {item.description.substring(0, 100)}...
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
                      {item.category}
                    </span>
                    <span
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: item.accessLevel === 'everyone' ? 'rgba(34, 197, 94, 0.1)' :
                                       item.accessLevel === 'lite' ? 'rgba(59, 130, 246, 0.1)' :
                                       'rgba(239, 68, 68, 0.1)',
                        color: item.accessLevel === 'everyone' ? '#86efac' :
                               item.accessLevel === 'lite' ? '#93c5fd' :
                               '#fca5a5'
                      }}
                    >
                      {item.accessLevel}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';