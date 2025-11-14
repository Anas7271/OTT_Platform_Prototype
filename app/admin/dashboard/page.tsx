'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface Content {
  _id: string;
  title: string;
  description: string;
  category: string;
  accessLevel: 'everyone' | 'lite' | 'premium';
  thumbnailPath: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/auth/login');
    }
  }, [user, router]);

  const fetchAdminContent = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });

      const response = await fetch(`/api/admin/content?${params.toString()}`, {
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
  }, [user, page]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminContent();
    }
  }, [user, page, fetchAdminContent]);

  const handleDeleteContent = async (contentId: string) => {
    if (!confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(contentId);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`/api/admin/content?id=${contentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete content');
      }

      // Remove the deleted content from the local state
      setContent(prevContent => prevContent.filter(item => item._id !== contentId));

      // Show success message
      alert('Content deleted successfully!');

      // If this was the last item on the current page and we're not on the first page, go back a page
      if (content.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        // Otherwise, refresh the current page content
        fetchAdminContent();
      }

    } catch (error: any) {
      console.error('Delete content error:', error);
      alert(error.message || 'Failed to delete content. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p style={{ color: 'var(--foreground)', opacity: 0.8 }}>You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>Admin Dashboard</h1>
            <p style={{ color: 'var(--foreground)', opacity: 0.8 }}>Welcome, {user.username}!</p>
          </div>
          <button onClick={logout} className="btn btn-danger">
            Logout
          </button>
        </div>

        {/* Content Management */}
        <div className="card mb-8">
          <div className="card-header">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Your Content</h2>
                <p style={{ color: 'var(--foreground)', opacity: 0.8 }}>Manage content you&apos;ve uploaded</p>
              </div>
              <a href="/admin/upload" className="btn btn-primary">
                Upload New Content
              </a>
            </div>
          </div>
          <div className="card-body">
            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <div style={{ color: 'var(--foreground)', opacity: 0.8 }}>Loading your content...</div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-8">
                <div style={{ color: '#fca5a5' }}>Error: {error}</div>
                <button
                  onClick={fetchAdminContent}
                  className="btn btn-primary mt-4"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && content.length === 0 && (
              <div className="text-center py-8">
                <div style={{ color: 'var(--foreground)', opacity: 0.8 }}>
                  You haven&apos;t uploaded any content yet. Start by uploading your first content!
                </div>
                <div className="mt-4">
                  <a href="/admin/upload" className="btn btn-primary">
                    Upload Your First Content
                  </a>
                </div>
              </div>
            )}

            {/* Content Grid */}
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
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>
                          {item.title}
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
                        {item.description.substring(0, 100)}{item.description.length > 100 ? '...' : ''}
                      </p>

                      <div className="flex justify-between items-center">
                        <span className="text-xs" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
                          {item.category}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Delete Button */}
                      <div className="mt-4 pt-3 border-t" style={{ borderColor: 'var(--card-border)' }}>
                        <button
                          onClick={() => handleDeleteContent(item._id)}
                          disabled={deleteLoading === item._id}
                          className="btn btn-danger w-full text-sm"
                          style={{
                            opacity: deleteLoading === item._id ? 0.6 : 1,
                            cursor: deleteLoading === item._id ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {deleteLoading === item._id ? 'Deleting...' : 'Delete Content'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';