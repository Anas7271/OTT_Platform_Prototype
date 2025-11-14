'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  role: Yup.string()
    .oneOf(['user', 'admin'], 'Invalid role')
    .default('user'),
  subscriptionPlan: Yup.string()
    .oneOf(['default', 'lite', 'premium'], 'Invalid subscription plan')
    .default('default'),
});

export default function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user',
      subscriptionPlan: 'default',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const { confirmPassword, ...userData } = values;
        await register(userData);
        // The AuthContext will handle the user state update
        // Add a small delay to allow state to update
        setTimeout(() => {
          if (userData.role === 'admin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/user/feed');
          }
        }, 100);
      } catch (error) {
        console.error('Registration error:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="card w-full max-w-md">
        <div className="card-header">
          <h2 className="text-2xl font-bold text-center" style={{ color: 'var(--foreground)' }}>Create Account</h2>
          <p className="text-center mt-1" style={{ color: 'var(--foreground)', opacity: 0.8 }}>Join our OTT platform</p>
        </div>
        <div className="card-body">
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`input ${
                  formik.touched.username && formik.errors.username ? 'border-red-500' : ''
                }`}
                required
              />
              {formik.touched.username && formik.errors.username && (
                <p className="mt-1 text-sm" style={{ color: '#fca5a5' }}>{formik.errors.username}</p>
              )}
            </div>

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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`input ${
                  formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : ''
                }`}
                required
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="mt-1 text-sm" style={{ color: '#fca5a5' }}>{formik.errors.confirmPassword}</p>
              )}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formik.values.role}
                onChange={(e) => {
                  formik.handleChange(e);
                  // If changing to admin, set subscription plan to default
                  if (e.target.value === 'admin') {
                    formik.setFieldValue('subscriptionPlan', 'default');
                  }
                }}
                onBlur={formik.handleBlur}
                className="select"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {formik.values.role === 'user' && (
              <div>
                <label htmlFor="subscriptionPlan" className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                  Subscription Plan
                </label>
                <select
                  id="subscriptionPlan"
                  name="subscriptionPlan"
                  value={formik.values.subscriptionPlan}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="select"
                >
                  <option value="default">Default (Free)</option>
                  <option value="lite">Lite (₹299/month)</option>
                  <option value="premium">Premium (₹599/month)</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="text-center">
              <Link href="/auth/login" style={{ color: '#3b82f6' }}>
                Already have an account? Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}