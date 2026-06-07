'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminFarmerSharesPage() {
  const [farmerShares, setFarmerShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchFarmerShares();
  }, []);

  const fetchFarmerShares = async () => {
    try {
      const response = await fetch('/api/farmershare');
      const data = await response.json();
      setFarmerShares(data.farmerShares || []);
    } catch (error) {
      console.error('Error fetching farmer shares:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredShares = farmerShares.filter(share => 
    filter === 'all' || share.status === filter
  );

  const deleteShare = async (id) => {
    if (!confirm('Are you sure you want to delete this farmer share?')) return;
    
    try {
      await fetch(`/api/farmershare?id=${id}`, { method: 'DELETE' });
      fetchFarmerShares();
    } catch (error) {
      console.error('Error deleting share:', error);
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
          <h1 className="text-3xl font-bold text-gray-900">Manage Farmer Shares</h1>
          <div className="flex gap-3">
            <Link href="/admin" className="px-4 py-2 text-gray-600 hover:text-gray-900">
              ← Back
            </Link>
            <Link href="/addFarmerShare" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              + Add Farmer Share
            </Link>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="funding">Funding</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Shares Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShares.map((share) => (
            <div key={share._id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
              {share.farmerImage && (
                <img src={share.farmerImage} alt={share.farmerName} className="w-full h-48 object-cover rounded-t-lg" />
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{share.farmerName}</h3>
                <p className="text-gray-600 mb-1">📍 {share.farmLocation}</p>
                <p className="text-gray-600 mb-1">🌾 {share.cropType}</p>
                <p className="text-gray-600 mb-3">💰 ₹{share.pricePerShare}/share</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Shares Sold</span>
                    <span>{share.totalShares - share.availableShares}/{share.totalShares}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${((share.totalShares - share.availableShares) / share.totalShares) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    share.status === 'open' ? 'bg-green-100 text-green-800' :
                    share.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {share.status}
                  </span>
                  <div className="text-sm">
                    {share.documentVerified && share.kycVerified ? '✅ Verified' : '⏳ Pending'}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link 
                    href={`/admin/farmer-shares/${share._id}`}
                    className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/editFarmerShare/${share._id}`}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => deleteShare(share._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
