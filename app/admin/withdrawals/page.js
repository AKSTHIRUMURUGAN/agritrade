'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminWithdrawalsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchWithdrawals = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/withdrawals');
      if (!res.ok) throw new Error('Failed to fetch withdrawal requests');
      const data = await res.json();
      setWithdrawals(data.withdrawals || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        router.push('/login');
      }
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchWithdrawals();
    }
  }, [user, fetchWithdrawals]);

  const handleAction = async (requestId, action) => {
    if (!confirm(`Are you sure you want to ${action} this request?`)) return;
    
    setProcessingId(requestId);
    try {
      const res = await fetch('/api/admin/withdrawals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action })
      });
      const data = await res.json();
      
      if (data.success) {
        alert(`Request successfully ${action}d!`);
        fetchWithdrawals();
      } else {
        alert(data.error || 'Failed to process request');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setProcessingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#1F2E22] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-[#1A251C] text-zinc-100 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header navigation */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-emerald-900/40">
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-wider">Withdrawal Approvals</h1>
            <p className="text-xs text-emerald-400 mt-1">Review and process user cash out requests</p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 bg-[#243527] border border-emerald-800/40 text-zinc-300 rounded-xl hover:text-white transition text-xs font-bold"
          >
            ← Admin Dashboard
          </Link>
        </div>

        {/* List Card panel */}
        <div className="bg-[#243527] border border-emerald-800/30 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6">
            <h2 className="text-sm font-black text-white uppercase tracking-wider mb-4">Pending Requests Queue</h2>

            {withdrawals.length === 0 ? (
              <div className="text-center py-12 text-zinc-500">
                <span className="text-4xl block mb-3">📬</span>
                <p className="text-xs">No withdrawal requests found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-emerald-900/40 text-[10px] text-zinc-500 uppercase font-black tracking-wider">
                      <th className="pb-3 pr-4">User</th>
                      <th className="pb-3 px-4">Amount</th>
                      <th className="pb-3 px-4">Method & Details</th>
                      <th className="pb-3 px-4">Request Date</th>
                      <th className="pb-3 px-4">Status</th>
                      <th className="pb-3 pl-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/20 text-xs">
                    {withdrawals.map((req) => (
                      <tr key={req._id} className="hover:bg-[#1F2E22]/30 transition">
                        <td className="py-4 pr-4">
                          <span className="font-bold text-white block">{req.userName || 'User'}</span>
                          <span className="text-[10px] text-zinc-500 block">{req.userEmail}</span>
                        </td>
                        <td className="py-4 px-4 font-black text-emerald-300">
                          🪙{req.amount}
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded text-[9px] font-bold uppercase inline-block mb-1">
                            {req.method}
                          </span>
                          <span className="block text-[10px] text-zinc-400 font-mono">{req.paymentDetails}</span>
                        </td>
                        <td className="py-4 px-4 text-zinc-400 text-[10px]">
                          {new Date(req.createdAt).toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            req.status === 'pending' ? 'bg-amber-950 text-amber-400 border border-amber-900/30' :
                            req.status === 'approved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/30' :
                            'bg-rose-950 text-rose-400 border border-rose-900/30'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="py-4 pl-4 text-right">
                          {req.status === 'pending' && (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleAction(req._id, 'approve')}
                                disabled={processingId === req._id}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-zinc-950 font-black text-[10px] rounded-lg transition"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleAction(req._id, 'reject')}
                                disabled={processingId === req._id}
                                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-[10px] rounded-lg transition"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
