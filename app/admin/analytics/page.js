'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
          <Link href="/admin" className="px-4 py-2 text-gray-600 hover:text-gray-900">
            ← Back
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Average Investment"
            value={`₹${analytics?.avgInvestment?.toLocaleString() || 0}`}
            trend="+12%"
            trendUp={true}
          />
          <MetricCard
            title="Success Rate"
            value={`${analytics?.successRate || 0}%`}
            trend="+5%"
            trendUp={true}
          />
          <MetricCard
            title="Avg. ROI"
            value={`${analytics?.avgROI || 0}%`}
            trend="+3%"
            trendUp={true}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Performing Crops</h2>
            <div className="space-y-3">
              {analytics?.topCrops?.map((crop, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{crop.name}</span>
                  <span className="font-semibold text-green-600">{crop.count} projects</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Investment by Status</h2>
            <div className="space-y-3">
              {analytics?.investmentByStatus?.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">{item.status}</span>
                    <span className="font-semibold">₹{item.amount?.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Growth</h2>
          <div className="h-64 flex items-end justify-around space-x-2">
            {analytics?.monthlyGrowth?.map((month, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-green-600 rounded-t"
                  style={{ height: `${(month.value / Math.max(...analytics.monthlyGrowth.map(m => m.value))) * 100}%` }}
                ></div>
                <span className="text-xs text-gray-600 mt-2">{month.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, trendUp }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm text-gray-600 mb-2">{title}</h3>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <span className={`text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </span>
      </div>
    </div>
  );
}
