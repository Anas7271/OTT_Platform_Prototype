'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface Content {
  _id: string;
  title: string;
  description: string;
  category: string;
  thumbnailPath: string;
  accessLevel: 'everyone' | 'lite' | 'premium';
  createdAt: string;
}

export default function ContentFeed() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  const categories = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi'];

  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchContent = useCallback(async () => {
    if (!user || !token) return;

    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });

      if (debouncedSearchTerm) {
        params.append('search', debouncedSearchTerm);
      }

      if (selectedCategory) {
        params.append('category', selectedCategory);
      }

      const response = await fetch(`/api/content/feed?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }

      const data = await response.json();
      setContent(data.content || []);
      setPagination(data.pagination);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [user, token, page, debouncedSearchTerm, selectedCategory]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const canAccessContent = (contentAccessLevel: string) => {
    if (!user) return false;

    switch (user.subscriptionPlan) {
      case 'premium':
        return true; // Can access everything
      case 'lite':
        return contentAccessLevel === 'everyone' || contentAccessLevel === 'lite';
      case 'default':
        return contentAccessLevel === 'everyone';
      default:
        return contentAccessLevel === 'everyone';
    }
  };

  return (
    <>
      {/* Search and Filter Controls - Always visible */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search content by title..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1); // Reset to first page when searching
              }}
              className="input w-full"
              style={{ color: 'var(--foreground)', backgroundColor: 'var(--card-bg)' }}
            />
          </div>

          {/* Category Filter */}
          <div className="md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1); // Reset to first page when filtering
              }}
              className="input w-full"
              style={{ color: 'var(--foreground)', backgroundColor: 'var(--card-bg)' }}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {(searchTerm || selectedCategory) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setPage(1);
            }}
            className="btn btn-secondary"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div style={{ color: 'var(--foreground)', opacity: 0.8 }}>Loading content...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <div style={{ color: '#fca5a5' }}>Error: {error}</div>
          <button
            onClick={fetchContent}
            className="btn btn-primary mt-4"
            style={{ color: 'var(--foreground)', opacity: 0.8 }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && content.length === 0 && (
        <div className="text-center py-8">
          <div style={{ color: 'var(--foreground)', opacity: 0.8 }}>
            No content available yet. Content will appear here once admins upload it.
          </div>
        </div>
      )}

      {/* Content Grid */}
      {!loading && !error && content.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((item) => {
            const canAccess = canAccessContent(item.accessLevel);

            return (
              <div
                key={item._id}
                className={`card cursor-pointer transition-transform hover:scale-105 ${canAccess ? '' : 'opacity-75'}`}
                onClick={() => {
                  if (canAccess) {
                    router.push(`/content/${item._id}`);
                  }
                }}
              >
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
                  {!canAccess && (
                    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                      <div className="text-center">
                        <span style={{ color: 'var(--foreground)' }} className="font-semibold text-lg">
                          {item.accessLevel === 'lite' ? 'Lite Required' : 'Premium Required'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>
                      {canAccess ? item.title : 'Premium Content'}
                    </h3>
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
                      {item.accessLevel === 'everyone' ? 'Free' :
                       item.accessLevel === 'lite' ? 'Lite' : 'Premium'}
                    </span>
                  </div>

                  <p className="text-sm mb-3" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
                    {canAccess ?
                      (item.description.substring(0, 100) + (item.description.length > 100 ? '...' : '')) :
                      'Upgrade your subscription to access this content.'
                    }
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
                      Category: {item.category}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="btn btn-secondary"
          >
            Previous
          </button>
          <span style={{ color: 'var(--foreground)', opacity: 0.8 }}>
            Page {page} of {pagination.pages} ({pagination.total} total)
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.pages}
            className="btn btn-secondary"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

export const dynamic = 'force-dynamic';