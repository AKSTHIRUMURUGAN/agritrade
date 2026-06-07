'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FarmerShareList() {
  const [farmerShares, setFarmerShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cropFilter, setCropFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchShares();
  }, []);

  const fetchShares = async () => {
    try {
      const res = await fetch('/api/farmershare');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setFarmerShares(data.farmerShares || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = farmerShares.filter((share) => {
    const matchesStatus = filter === 'all' || share.status === filter;
    const matchesCrop = !cropFilter || share.cropType?.toLowerCase().includes(cropFilter.toLowerCase());
    const matchesSearch =
      !searchTerm ||
      share.farmerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      share.farmLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      share.cropType?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesCrop && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Investment Opportunities</h1>
        <p className="text-gray-600">Browse verified farming projects and invest in India's agricultural future</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4 mb-8 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by farmer, location, or crop..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="funding">Funding</option>
          <option value="in-progress">In Progress</option>
          <option value="harvesting">Harvesting</option>
          <option value="completed">Completed</option>
        </select>
        <input
          type="text"
          placeholder="Filter by crop..."
          value={cropFilter}
          onChange={(e) => setCropFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">{filtered.length} opportunities found</p>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🌾</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No opportunities found</h2>
          <p className="text-gray-600">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((share) => {
            const fundingPercent = Math.round(
              ((share.totalShares - share.availableShares) / share.totalShares) * 100
            );
            return (
              <Link key={share._id} href={`/farmershares/${share._id}`}>
                <div className="bg-white rounded-2xl shadow hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer group">
                  {/* Image */}
                  {share.farmerImage ? (
                    <img
                      src={share.farmerImage}
                      alt={share.farmerName}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
                      <span className="text-6xl">🌾</span>
                    </div>
                  )}

                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition">
                          {share.farmerName}
                        </h3>
                        <p className="text-sm text-gray-500">📍 {share.farmLocation}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium flex-shrink-0 ${
                        share.status === 'open' ? 'bg-green-100 text-green-800' :
                        share.status === 'funding' ? 'bg-blue-100 text-blue-800' :
                        share.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        share.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {share.status}
                      </span>
                    </div>

                    {/* Crop & Method */}
                    <div className="flex gap-2 mb-3">
                      <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                        🌱 {share.cropType}
                      </span>
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full capitalize">
                        {share.farmingMethod}
                      </span>
                    </div>

                    {/* Funding Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{fundingPercent}% funded</span>
                        <span>{share.availableShares} shares left</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${fundingPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Key Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-500">Price/Share</p>
                        <p className="font-bold text-gray-900 text-sm">₹{share.pricePerShare?.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-500">Returns</p>
                        <p className="font-bold text-green-600 text-sm">{share.expectedReturn}%</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="font-bold text-gray-900 text-sm">{share.duration}mo</p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        {share.documentVerified && share.kycVerified && (
                          <span className="text-xs text-green-600 font-medium">✅ Verified</span>
                        )}
                        {share.assured && (
                          <span className="text-xs text-purple-600 font-medium">🛡️ Assured</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">{'⭐'.repeat(share.ranking || 0)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
