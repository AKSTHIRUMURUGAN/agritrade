'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminReportsPage() {
  const [reportType, setReportType] = useState('investment');
  const [dateRange, setDateRange] = useState('month');

  const generateReport = () => {
    alert(`Generating ${reportType} report for ${dateRange}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Reports & Export</h1>
          <Link href="/admin" className="px-4 py-2 text-gray-600 hover:text-gray-900">
            ← Back
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Generate Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="investment">Investment Report</option>
                <option value="investor">Investor Report</option>
                <option value="project">Project Report</option>
                <option value="financial">Financial Report</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>
          <button
            onClick={generateReport}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
          >
            Generate & Download Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReportCard
            title="Investment Summary"
            description="Total investments, returns, and performance metrics"
            icon="💰"
          />
          <ReportCard
            title="Investor Activity"
            description="Investor demographics and investment patterns"
            icon="👥"
          />
          <ReportCard
            title="Project Performance"
            description="Success rates, completion times, and ROI analysis"
            icon="📊"
          />
          <ReportCard
            title="Financial Overview"
            description="Revenue, expenses, and profit margins"
            icon="💵"
          />
        </div>
      </div>
    </div>
  );
}

function ReportCard({ title, description, icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
      <div className="flex items-start space-x-4">
        <div className="text-4xl">{icon}</div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}
