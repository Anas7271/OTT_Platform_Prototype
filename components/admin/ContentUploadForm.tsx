'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/lib/auth-context';

const validationSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .min(1, 'Title must be at least 1 character')
    .max(200, 'Title must be less than 200 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  category: Yup.string()
    .required('Category is required')
    .oneOf(['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi'], 'Invalid category'),
  accessLevel: Yup.string()
    .required('Access level is required')
    .oneOf(['everyone', 'lite', 'premium'], 'Invalid access level'),
  thumbnail: Yup.mixed()
    .required('Thumbnail is required')
    .test('fileType', 'Only image files are allowed', (value) => {
      if (!value) return false;
      return value instanceof File && value.type.startsWith('image/');
    })
    .test('fileSize', 'File size must be less than 5MB', (value) => {
      if (!value) return false;
      return value instanceof File && value.size <= 5 * 1024 * 1024;
    }),
});

export default function ContentUploadForm() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      category: '',
      accessLevel: 'everyone',
      thumbnail: null as File | null,
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      setSuccess('');

      try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('category', values.category);
        formData.append('accessLevel', values.accessLevel);
        if (values.thumbnail) {
          formData.append('thumbnail', values.thumbnail);
        }

        const response = await fetch('/api/admin/content', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        console.log('Upload response status:', response.status);
        console.log('Token being sent:', token ? 'Token exists' : 'No token');

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Upload failed');
        }

        setSuccess('Content uploaded successfully!');
        formik.resetForm();
      } catch (error: any) {
        setError(error.message || 'Upload failed');
      } finally {
        setLoading(false);
      }
    },
  });

  // Check if user is authenticated
  if (!token) {
    return (
      <div className="card w-full max-w-2xl mx-auto">
        <div className="card-body text-center">
          <p style={{ color: '#fca5a5' }}>Authentication required. Please log in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card w-full max-w-2xl mx-auto">
      <div className="card-header">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Upload Content</h2>
        <p style={{ color: 'var(--foreground)', opacity: 0.8 }}>Add new content to the platform</p>
      </div>
      <div className="card-body">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {error && (
            <div className="px-4 py-3 rounded" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)', color: '#fca5a5' }}>
              {error}
            </div>
          )}

          {success && (
            <div className="px-4 py-3 rounded" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#86efac' }}>
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Thumbnail
            </label>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              style={{ color: 'var(--foreground)', opacity: 0.7 }}
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                formik.setFieldValue('thumbnail', file);
              }}
              onBlur={formik.handleBlur}
            />
            {formik.touched.thumbnail && formik.errors.thumbnail && (
              <p className="mt-1 text-sm" style={{ color: '#fca5a5' }}>{formik.errors.thumbnail}</p>
            )}
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`input ${
                formik.touched.title && formik.errors.title ? 'border-red-500' : ''
              }`}
              required
            />
            {formik.touched.title && formik.errors.title && (
              <p className="mt-1 text-sm" style={{ color: '#fca5a5' }}>{formik.errors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`textarea ${
                formik.touched.description && formik.errors.description ? 'border-red-500' : ''
              }`}
              rows={3}
              required
            />
            {formik.touched.description && formik.errors.description && (
              <p className="mt-1 text-sm" style={{ color: '#fca5a5' }}>{formik.errors.description}</p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`select ${
                formik.touched.category && formik.errors.category ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select a category</option>
              <option value="Action">Action</option>
              <option value="Comedy">Comedy</option>
              <option value="Drama">Drama</option>
              <option value="Horror">Horror</option>
              <option value="Romance">Romance</option>
              <option value="Sci-Fi">Sci-Fi</option>
            </select>
            {formik.touched.category && formik.errors.category && (
              <p className="mt-1 text-sm" style={{ color: '#fca5a5' }}>{formik.errors.category}</p>
            )}
          </div>

          <div>
            <label htmlFor="accessLevel" className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
              Access Level
            </label>
            <select
              id="accessLevel"
              name="accessLevel"
              value={formik.values.accessLevel}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`select ${
                formik.touched.accessLevel && formik.errors.accessLevel ? 'border-red-500' : ''
              }`}
            >
              <option value="everyone">Everyone</option>
              <option value="lite">Lite & Premium</option>
              <option value="premium">Premium Only</option>
            </select>
            {formik.touched.accessLevel && formik.errors.accessLevel && (
              <p className="mt-1 text-sm" style={{ color: '#fca5a5' }}>{formik.errors.accessLevel}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Content'}
          </button>
        </form>
      </div>
    </div>
  );
}