'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
});

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      try {
        const user = await login(values.email, values.password);
        // Add a small delay to allow state to update
        setTimeout(() => {
          if (user?.role === 'admin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/user/feed');
          }
        }, 100);
      } catch (error: any) {
        setError(error.message || 'Login failed');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="card w-full max-w-md">
        <div className="card-header">
          <h2 className="text-2xl font-bold text-center" style={{ color: 'var(--foreground)' }}>Welcome Back</h2>
          <p className="text-center mt-1" style={{ color: 'var(--foreground)', opacity: 0.8 }}>Login to your account</p>
        </div>
        <div className="card-body">
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {error && (
              <div className="px-4 py-3 rounded" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)', color: '#fca5a5' }}>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`input ${
                  formik.touched.email && formik.errors.email ? 'border-red-500' : ''
                }`}
                required
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm" style={{ color: '#fca5a5' }}>{formik.errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`input ${
                  formik.touched.password && formik.errors.password ? 'border-red-500' : ''
                }`}
                required
              />
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-sm" style={{ color: '#fca5a5' }}>{formik.errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="text-center">
              <Link href="/auth/register" style={{ color: '#3b82f6' }}>
                Don&apos;t have an account? Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}