'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface Content {
  _id: string;
  title: string;
  description: string;
  category: string;
  thumbnailPath: string;
  accessLevel: 'everyone' | 'lite' | 'premium';
  createdAt: string;
}

export default function ContentDetailPage({ params }: { params: { id: string } }) {
  const { user, token } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchContent = useCallback(async (id: string) => {
    if (!token) {
      setError('Authentication required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/content/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }

      const data = await response.json();
      setContent(data.content);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (params.id) {
      fetchContent(params.id);
    }
  }, [params.id, fetchContent]);

  const canAccessContent = (contentAccessLevel: string) => {
    if (!user) return false;

    switch (user.subscriptionPlan) {
      case 'premium':
        return true;
      case 'lite':
        return contentAccessLevel === 'everyone' || contentAccessLevel === 'lite';
      case 'default':
        return contentAccessLevel === 'everyone';
      default:
        return contentAccessLevel === 'everyone';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Loading content...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p style={{ color: 'var(--foreground)', opacity: 0.7 }}>{error}</p>
          <button
            onClick={() => router.back()}
            className="btn btn-primary mt-4"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Content Not Found</h1>
          <p style={{ color: 'var(--foreground)', opacity: 0.7 }}>The requested content could not be found.</p>
          <button
            onClick={() => router.back()}
            className="btn btn-primary mt-4"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const canAccess = canAccessContent(content.accessLevel);

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: 'var(--background)' }}>
      <button
        onClick={() => router.back()}
        className="btn btn-secondary mb-4"
      >
        ← Back to Feed
      </button>

      <div className="card" style={{ maxWidth: '95vw', margin: '0 auto' }}>
        <div className="w-full bg-gray-200 rounded-t-lg relative overflow-hidden" style={{ height: '70vh', maxHeight: '800px' }}>
            {canAccess && content.thumbnailPath ? (
              <img
                src={content.thumbnailPath}
                alt={content.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-300">
                <span style={{ color: 'var(--foreground)', opacity: 0.6 }}>
                  {canAccess ? 'No Thumbnail' : 'Upgrade Required'}
                </span>
              </div>
            )}
            {!canAccess && (
              <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                <div className="text-center">
                  <span style={{ color: 'var(--foreground)' }} className="font-semibold text-lg">
                    {content.accessLevel === 'lite' ? 'Lite Subscription Required' : 'Premium Subscription Required'}
                  </span>
                </div>
              </div>
            )}
          </div>

        <div className="p-4 md:p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4">
            <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl flex-1" style={{ color: 'var(--foreground)' }}>
              {canAccess ? content.title : 'Premium Content'}
            </h1>
                <span
                className="px-4 py-2 rounded-lg text-sm md:text-base font-medium self-start"
                style={{
                  backgroundColor: content.accessLevel === 'everyone' ? 'rgba(34, 197, 94, 0.1)' :
                                 content.accessLevel === 'lite' ? 'rgba(59, 130, 246, 0.1)' :
                                 'rgba(239, 68, 68, 0.1)',
                  color: content.accessLevel === 'everyone' ? '#86efac' :
                         content.accessLevel === 'lite' ? '#93c5fd' :
                         '#fca5a5'
                }}
              >
                {content.accessLevel === 'everyone' ? 'Free' :
                 content.accessLevel === 'lite' ? 'Lite' : 'Premium'}
              </span>
            </div>

            <div className="mb-8">
              <h2 className="text-xl md:text-2xl font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
                Description
              </h2>
              <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--foreground)', opacity: 0.8 }}>
                {canAccess ? content.description : 'Upgrade your subscription to view this content.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-sm md:text-base" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
              <div className="flex flex-col">
                <span className="font-medium mb-1">Category</span>
                <span className="text-base md:text-lg">{content.category}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium mb-1">Upload Date</span>
                <span className="text-base md:text-lg">
                  {new Date(content.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';