'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminInvestorsPage() {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInvestors();
  }, []);

  const fetchInvestors = async () => {
    try {
      const response = await fetch('/api/admin/investors');
      const data = await response.json();
      setInvestors(data.investors || []);
    } catch (error) {
      console.error('Error fetching investors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvestors = investors.filter(investor =>
    investor.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investor.userId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Investors Management</h1>
          <Link href="/admin" className="px-4 py-2 text-gray-600 hover:text-gray-900">
            ← Back
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <input
            type="text"
            placeholder="Search investors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Investor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Investment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Projects</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Returns</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvestors.map((investor) => (
                <tr key={investor.userId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{investor.userName}</div>
                    <div className="text-sm text-gray-500">{investor.userId}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">₹{investor.totalInvestment?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{investor.projectCount}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">₹{investor.totalReturns?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
