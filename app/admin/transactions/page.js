'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalVolume: 0, totalTransactions: 0, completedCount: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/admin/transactions');
      const data = await res.json();
      setTransactions(data.transactions || []);
      setSummary(data.summary || {});
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = transactions.filter((t) => {
    const matchesFilter = filter === 'all' || t.status === filter;
    const matchesSearch =
      !searchTerm ||
      t.investor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.project?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <Link href="/admin" className="px-4 py-2 text-gray-600 hover:text-gray-900">← Back</Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">Total Volume</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">₹{summary.totalVolume?.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">Total Transactions</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{summary.totalTransactions}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">Completed Investments</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{summary.completedCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by investor or project..."
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
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Investor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shares</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Returns</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filtered.map((t, i) => (
                  <tr key={t.id || i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{t.investor}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {t.projectId ? (
                        <Link href={`/admin/farmer-shares/${t.projectId}`} className="text-green-600 hover:underline">
                          {t.project}
                        </Link>
                      ) : t.project}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{t.sharesOwned}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{t.amount?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">
                      {t.returnAmount > 0 ? `₹${t.returnAmount?.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {t.date ? new Date(t.date).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        t.status === 'active' ? 'bg-green-100 text-green-800' :
                        t.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
