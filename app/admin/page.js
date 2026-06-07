'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalLands: 0,
    totalFarmerShares: 0,
    totalInvestment: 0,
    totalInvestors: 0,
    activeLands: 0,
    completedProjects: 0,
    pendingVerifications: 0,
    totalRevenue: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchDashboardData();
    }
  }, [user, authLoading, router]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();
      setStats(data.stats);
      setRecentActivities(data.recentActivities || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.displayName || user?.email || 'Admin'}</p>
            </div>
            <Link href="/" className="text-green-600 hover:text-green-700">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Lands"
            value={stats.totalLands}
            icon="🏞️"
            color="blue"
          />
          <StatCard
            title="Farmer Shares"
            value={stats.totalFarmerShares}
            icon="🌾"
            color="green"
          />
          <StatCard
            title="Total Investment"
            value={`₹${(stats.totalInvestment / 100000).toFixed(1)}L`}
            icon="💰"
            color="yellow"
          />
          <StatCard
            title="Total Investors"
            value={stats.totalInvestors}
            icon="👥"
            color="purple"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Active Projects"
            value={stats.activeLands}
            icon="✅"
            color="green"
            small
          />
          <StatCard
            title="Completed Projects"
            value={stats.completedProjects}
            icon="🎉"
            color="blue"
            small
          />
          <StatCard
            title="Pending Verifications"
            value={stats.pendingVerifications}
            icon="⏳"
            color="orange"
            small
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ActionButton href="/admin/lands" icon="🏞️" label="Manage Lands" />
            <ActionButton href="/admin/farmer-shares" icon="🌾" label="Farmer Shares" />
            <ActionButton href="/admin/investors" icon="👥" label="Investors" />
            <ActionButton href="/admin/verifications" icon="✓" label="Verifications" />
            <ActionButton href="/admin/analytics" icon="📊" label="Analytics" />
            <ActionButton href="/admin/reports" icon="📈" label="Reports" />
            <ActionButton href="/admin/settings" icon="⚙️" label="Settings" />
            <ActionButton href="/addLand" icon="➕" label="Add Land" />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <ActivityItem key={index} activity={activity} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No recent activities</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, small }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg shadow-lg p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`${small ? 'text-sm' : 'text-base'} opacity-90`}>{title}</p>
          <p className={`${small ? 'text-2xl' : 'text-3xl'} font-bold mt-2`}>{value}</p>
        </div>
        <div className={`${small ? 'text-3xl' : 'text-4xl'}`}>{icon}</div>
      </div>
    </div>
  );
}

function ActionButton({ href, icon, label }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition border border-gray-200"
    >
      <span className="text-3xl mb-2">{icon}</span>
      <span className="text-sm font-medium text-gray-700 text-center">{label}</span>
    </Link>
  );
}

function ActivityItem({ activity }) {
  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
      <div className="flex-shrink-0 text-2xl">{activity.icon || '📌'}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
        <p className="text-sm text-gray-500">{activity.description}</p>
        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
      </div>
    </div>
  );
}