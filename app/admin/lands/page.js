'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminLandsPage() {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLands();
  }, []);

  const fetchLands = async () => {
    try {
      const response = await fetch('/api/land');
      const data = await response.json();
      setLands(data.lands || []);
    } catch (error) {
      console.error('Error fetching lands:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLands = lands.filter(land => {
    const matchesFilter = filter === 'all' || land.status === filter;
    const matchesSearch = land.landName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         land.landPlace?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const deleteLand = async (id) => {
    if (!confirm('Are you sure you want to delete this land?')) return;
    
    try {
      await fetch(`/api/land?id=${id}`, { method: 'DELETE' });
      fetchLands();
    } catch (error) {
      console.error('Error deleting land:', error);
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
          <h1 className="text-3xl font-bold text-gray-900">Manage Lands</h1>
          <div className="flex gap-3">
            <Link href="/admin" className="px-4 py-2 text-gray-600 hover:text-gray-900">
              ← Back
            </Link>
            <Link href="/addLand" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              + Add New Land
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search lands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Lands Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Land</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLands.map((land) => (
                <tr key={land._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {land.landImage && (
                        <img src={land.landImage} alt={land.landName} className="h-10 w-10 rounded object-cover mr-3" />
                      )}
                      <div className="text-sm font-medium text-gray-900">{land.landName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{land.landPlace}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{land.totalStock}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">₹{land.perStockPrice}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      land.status === 'open' ? 'bg-green-100 text-green-800' :
                      land.status === 'closed' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {land.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {land.documentVerified && land.kycVerified ? '✅' : '⏳'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Link href={`/editLand/${land._id}`} className="text-blue-600 hover:text-blue-900">
                        Edit
                      </Link>
                      <button onClick={() => deleteLand(land._id)} className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </div>
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
