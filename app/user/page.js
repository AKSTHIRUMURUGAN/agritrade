'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function UserProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow p-8 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
              ) : (
                (user.name?.[0] || user.email?.[0])?.toUpperCase()
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{user.name || 'User'}</h1>
              <p className="text-gray-500 mt-1">{user.email}</p>
              <span className={`inline-block mt-2 px-3 py-1 text-sm rounded-full font-medium ${
                user.role === 'admin' ? 'bg-red-100 text-red-800' :
                user.role === 'farmer' ? 'bg-green-100 text-green-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {user.role || 'user'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Link href="/user/investments" className="bg-white rounded-xl shadow p-5 hover:shadow-md transition flex items-center gap-4">
            <div className="text-3xl">📊</div>
            <div>
              <p className="font-semibold text-gray-900">My Investments</p>
              <p className="text-sm text-gray-500">View portfolio</p>
            </div>
          </Link>
          <Link href="/farmershares" className="bg-white rounded-xl shadow p-5 hover:shadow-md transition flex items-center gap-4">
            <div className="text-3xl">🌾</div>
            <div>
              <p className="font-semibold text-gray-900">Browse Opportunities</p>
              <p className="text-sm text-gray-500">Find new projects</p>
            </div>
          </Link>
          {user.role === 'admin' && (
            <Link href="/admin" className="bg-white rounded-xl shadow p-5 hover:shadow-md transition flex items-center gap-4">
              <div className="text-3xl">⚙️</div>
              <div>
                <p className="font-semibold text-gray-900">Admin Dashboard</p>
                <p className="text-sm text-gray-500">Manage platform</p>
              </div>
            </Link>
          )}
        </div>

        {/* Account Details */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Account Details</h2>
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Full Name</span>
              <span className="font-medium text-gray-900">{user.name || '—'}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Email Address</span>
              <span className="font-medium text-gray-900">{user.email}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Account Role</span>
              <span className="font-medium text-gray-900 capitalize">{user.role || 'user'}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-600">User ID</span>
              <span className="font-medium text-gray-500 text-sm">{user.id}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Account Actions</h2>
          <div className="flex gap-4">
            <button
              onClick={logout}
              className="px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
