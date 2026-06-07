'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import BadgeRow from '../../components/BadgeRow';

export default function LandPage() {
  const { user } = useAuth();
  const [lands, setLands] = useState([]);
  const [userInvestments, setUserInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchLands = useCallback(async () => {
    try {
      const res = await fetch('/api/land');
      if (!res.ok) throw new Error('Failed to fetch lands');
      const data = await res.json();
      setLands(data.lands || []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchUserInvestments = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/investment?userId=${user.id}`);
      if (!res.ok) throw new Error('Failed to fetch investments');
      const data = await res.json();
      setUserInvestments(data.investments || []);
    } catch (error) {
      console.error(error);
    }
  }, [user?.id]);

  useEffect(() => {
    Promise.all([fetchLands(), fetchUserInvestments()]).finally(() => {
      setLoading(false);
    });
  }, [user, fetchLands, fetchUserInvestments]);

  const isOwned = (landId) => {
    return userInvestments.some(
      (inv) => inv.projectId === landId && inv.projectType === 'land' && inv.status === 'active'
    );
  };

  const filtered = lands.filter((land) => {
    const matchesStatus = filter === 'all' || land.status === filter;
    const matchesSearch =
      !searchTerm ||
      land.landName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      land.landPlace?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      land.seed?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1F2E22] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A251C] text-zinc-100">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-b from-[#2E4231] to-[#1A251C] pt-8 pb-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Custom Logo */}
            <div className="w-12 h-12 rounded-xl bg-[#2D4A30] border border-emerald-800/40 p-2 flex items-center justify-center">
              <span className="text-2xl">🌾</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Land Stocks</h1>
              <p className="text-xs text-emerald-400">Buy fractional shares in high-yield farmlands</p>
            </div>
          </div>

          {/* Quick Stats Banner from Figma */}
          {user && (
            <div className="flex items-center gap-3 bg-[#243527]/90 px-4 py-2 rounded-2xl border border-emerald-800/20 shadow-md">
              <div className="flex items-center gap-2">
                <span className="text-[#EAB308]">🪙</span>
                <span className="text-xs font-semibold">Active Portfolios</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-emerald-300 font-bold text-sm">
                {userInvestments.filter((i) => i.status === 'active').length}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters Panel */}
        <div className="bg-[#243527] border border-emerald-800/30 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search farmlands, crops, locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#1F2E22] border border-emerald-900/40 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition text-sm"
            />
          </div>

          <div className="flex w-full md:w-auto gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="flex-1 md:flex-none px-4 py-2.5 bg-[#1F2E22] border border-emerald-900/40 rounded-xl text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Status Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-zinc-400">{filtered.length} farmlands available</p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Live Markets</span>
          </div>
        </div>

        {/* Lands Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-[#243527]/30 border border-emerald-900/20 rounded-2xl">
            <div className="text-5xl mb-3">🏞️</div>
            <h2 className="text-lg font-semibold text-zinc-300">No Lands Listed</h2>
            <p className="text-xs text-zinc-500 mt-1">Try adjusting your filters or search keywords</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((land) => {
              const owned = isOwned(land._id);
              
              // Calculate Price Trend Percentage
              const prev = land.previousAmount || land.perStockPrice || 0;
              const curr = land.currentAmount || land.perStockPrice || 0;
              const trend = prev > 0 ? ((curr - prev) / prev) * 100 : 0.84;
              const isPositive = trend >= 0;

              // Format date timestamp
              const daysDiff = Math.floor((Date.now() - new Date(land.createdAt).getTime()) / (1000 * 3600 * 24));
              const ageText = daysDiff === 0 ? 'Today' : daysDiff === 1 ? 'Yesterday' : `${daysDiff} days ago`;

              return (
                <div
                  key={land._id}
                  className="bg-[#243527] border border-emerald-800/30 hover:border-emerald-700/60 rounded-3xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-5 flex-1">
                    {/* Top Header Card */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      {/* Left: Donut SVG Chart Placeholder */}
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#2D4A30" strokeWidth="4.5" />
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#a855f7" strokeWidth="4.5" strokeDasharray="30 70" strokeDashoffset="25" />
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4.5" strokeDasharray="25 75" strokeDashoffset="95" />
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#eab308" strokeWidth="4.5" strokeDasharray="20 80" strokeDashoffset="120" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                            %
                          </div>
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white tracking-wide line-clamp-1">
                            {land.landName}
                          </h3>
                          <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                            📍 {land.landPlace}
                          </span>
                        </div>
                      </div>

                      {/* Right: Trend chip indicator */}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold ${
                        isPositive ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                      }`}>
                        {isPositive ? '↑' : '↓'} {Math.abs(trend).toFixed(2)}%
                      </span>
                    </div>

                    {/* Stock Price Display */}
                    <div className="bg-[#1F2E22] px-4 py-3 rounded-2xl border border-emerald-900/30 mb-4 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Price / Stock</span>
                        <span className="text-lg font-black text-emerald-300">₹{land.perStockPrice}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Min. Investment</span>
                        <span className="text-xs font-bold text-zinc-300">₹{land.minimumStockPrice || (land.perStockPrice * land.minimumStock)}</span>
                      </div>
                    </div>

                    {/* Badges Section */}
                    <div className="mb-4">
                      <BadgeRow
                        soilTest={land.soilTest}
                        kycVerified={land.kycVerified}
                        documentVerified={land.documentVerified}
                        ranking={land.ranking}
                      />
                    </div>

                    {/* Bottom Info Status bar */}
                    <div className="flex items-center justify-between text-zinc-400 text-xs mt-3 pt-3 border-t border-emerald-900/40">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Listed {ageText}</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#EAB308] uppercase tracking-wide">
                        {land.seed || 'Seeds'}
                      </span>
                    </div>
                  </div>

                  {/* Buy / Owned CTA Button */}
                  <div className="px-5 pb-5">
                    {owned ? (
                      <Link
                        href={`/land/${land._id}`}
                        className="block w-full py-3 text-center bg-[#EAB308]/20 hover:bg-[#EAB308]/30 border border-[#EAB308]/40 text-[#EAB308] font-bold text-sm rounded-xl transition duration-200"
                      >
                        OWNED
                      </Link>
                    ) : (
                      <Link
                        href={`/land/${land._id}`}
                        className="block w-full py-3 text-center bg-[#EAB308] hover:bg-[#D9A307] text-zinc-950 font-black text-sm rounded-xl transition duration-200 shadow-md shadow-[#EAB308]/10"
                      >
                        BUY STOCK
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
