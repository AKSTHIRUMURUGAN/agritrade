'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserInvestmentsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Tab State: 'buyed' | 'selled' | 'all'
  const [activeTab, setActiveTab] = useState('buyed');
  
  // Sell flow states
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [selectedInv, setSelectedInv] = useState(null);
  const [sellQuantity, setSellQuantity] = useState(1);
  const [selling, setSelling] = useState(false);
  const [sellSuccessOpen, setSellSuccessOpen] = useState(false);
  
  // Guard message alert state
  const [showGuardAlert, setShowGuardAlert] = useState(false);
  const [guardAlertMsg, setGuardAlertMsg] = useState('');

  const fetchInvestments = useCallback(async () => {
    try {
      const response = await fetch(`/api/investment?userId=${user.id}`);
      const data = await response.json();
      setInvestments(data.investments || []);
    } catch (error) {
      console.error('Error fetching investments:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.id) {
      fetchInvestments();
    }
  }, [user, fetchInvestments]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#1F2E22] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!user) return null;

  // Filter investments based on status
  // active -> Buyed Stock
  // withdrawn -> Selled Stock
  const filteredInvestments = investments.filter((inv) => {
    if (activeTab === 'buyed') return inv.status === 'active';
    if (activeTab === 'selled') return inv.status === 'withdrawn';
    return true; // all stocks
  });

  // Helper to map DB Status to Display Status in Figma
  const getDisplayStatus = (status) => {
    if (!status) return 'PREPARATION OF SOIL';
    switch (status.toLowerCase()) {
      case 'open':
        return 'FUNDRAISING';
      case 'funding':
        return 'FUNDING IN PROGRESS';
      case 'in-progress':
        return 'PREPARATION OF SOIL';
      case 'harvesting':
        return 'HARVESTING';
      case 'completed':
        return 'COMPLETED';
      case 'closed':
        return 'CLOSED';
      default:
        return status.toUpperCase();
    }
  };

  // Helper to calculate waiting period remaining (days)
  const getWaitingPeriod = (inv) => {
    if (inv.landStatus === 'completed' || inv.status === 'withdrawn') return '0d';
    const startDate = new Date(inv.investmentDate);
    const durationMonths = inv.duration || 6;
    const endDate = new Date(startDate.getTime() + durationMonths * 30 * 24 * 60 * 60 * 1000);
    const timeDiff = endDate.getTime() - Date.now();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff > 0 ? `${daysDiff}d` : '0d';
  };

  const handleSellClick = (inv) => {
    // Check if land project status is completed
    if (inv.landStatus !== 'completed') {
      setGuardAlertMsg(`⚠️ UNABLE TO SELL THE PRODUCT PLEASE WAIT UNTIL THE STATUS IS COMPLETED ⚠️`);
      setShowGuardAlert(true);
      
      // Auto-hide alert after 5 seconds
      setTimeout(() => {
        setShowGuardAlert(false);
      }, 5000);
      return;
    }

    // Open Sell modal sheet
    setSelectedInv(inv);
    setSellQuantity(1);
    setSellModalOpen(true);
  };

  const handleConfirmSell = async () => {
    if (sellQuantity > selectedInv.sharesOwned) {
      alert('Cannot sell more shares than you own.');
      return;
    }

    setSelling(true);
    try {
      const res = await fetch('/api/investment', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedInv.projectId,
          userId: user.id,
          investmentId: selectedInv._id,
          sharesToSell: sellQuantity,
          sellPrice: selectedInv.currentPrice || selectedInv.investmentAmount / selectedInv.sharesOwned,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSellModalOpen(false);
        setSellSuccessOpen(true);
        fetchInvestments();
      } else {
        alert(data.error || 'Failed to sell stock.');
      }
    } catch (error) {
      console.error('Error confirmation sell:', error);
      alert('An error occurred during transaction.');
    } finally {
      setSelling(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A251C] text-zinc-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header from Figma layout */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black tracking-widest text-white uppercase">Your Stock</h1>
          <p className="text-xs text-emerald-400 mt-1">Track and manage your agricultural holdings</p>
        </div>

        {/* Custom Tab Selector from Figma */}
        <div className="bg-[#243527] border border-emerald-900/40 rounded-xl p-1 mb-8 flex justify-between">
          <button
            onClick={() => setActiveTab('buyed')}
            className={`flex-1 text-center py-2.5 rounded-lg text-xs font-black tracking-wider transition-all duration-200 ${
              activeTab === 'buyed'
                ? 'bg-zinc-800 text-white shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            BUYED STOCK
          </button>
          <button
            onClick={() => setActiveTab('selled')}
            className={`flex-1 text-center py-2.5 rounded-lg text-xs font-black tracking-wider transition-all duration-200 ${
              activeTab === 'selled'
                ? 'bg-zinc-800 text-white shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            SELLED STOCK
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 text-center py-2.5 rounded-lg text-xs font-black tracking-wider transition-all duration-200 ${
              activeTab === 'all'
                ? 'bg-zinc-800 text-white shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            ALL STOCKS
          </button>
        </div>

        {/* Guard Warning Box */}
        {showGuardAlert && (
          <div className="bg-rose-950/70 border border-rose-800/60 p-4 rounded-xl text-center text-rose-200 text-xs font-bold mb-6 animate-pulse">
            {guardAlertMsg}
          </div>
        )}

        {/* Stocks List */}
        {filteredInvestments.length === 0 ? (
          <div className="bg-[#243527]/40 border border-emerald-900/30 rounded-3xl p-12 text-center">
            <span className="text-4xl block mb-3">📊</span>
            <p className="text-sm font-semibold text-zinc-400">No stock records found in this category</p>
            <Link
              href="/land"
              className="inline-block mt-4 text-xs font-bold text-emerald-400 hover:underline"
            >
              Browse land opportunities →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInvestments.map((inv) => {
              const buyedPrice = Math.round(inv.investmentAmount / inv.sharesOwned);
              const currentPrice = inv.currentPrice || buyedPrice;
              
              // Calculate Trend
              const trend = buyedPrice > 0 ? ((currentPrice - buyedPrice) / buyedPrice) * 100 : 0.84;
              const isPositive = trend >= 0;

              return (
                <div
                  key={inv._id}
                  className="bg-[#243527] border border-emerald-800/30 hover:border-emerald-700/40 rounded-2xl p-5 transition duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Left Column Details */}
                  <div className="space-y-2.5 flex-1">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="text-[10px] text-zinc-400 block font-mono">
                        STOCK ID: <span className="text-zinc-100 font-bold">#{inv._id.substring(inv._id.length - 4).toUpperCase()}</span>
                      </span>
                      <span className="text-[10px] text-zinc-400 block">
                        STOCK NAME: <span className="text-white font-extrabold uppercase">{inv.projectName}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                      <div className="bg-[#1F2E22] px-3.5 py-2 rounded-xl border border-emerald-900/30">
                        <span className="text-[9px] text-zinc-500 uppercase tracking-wider block mb-0.5">Buyed Price</span>
                        <span className="text-xs font-bold text-zinc-200">₹{buyedPrice}</span>
                      </div>
                      <div className="bg-[#1F2E22] px-3.5 py-2 rounded-xl border border-emerald-900/30">
                        <span className="text-[9px] text-zinc-500 uppercase tracking-wider block mb-0.5">Current Price</span>
                        <span className="text-xs font-bold text-emerald-300">₹{currentPrice}</span>
                      </div>
                      <div className="bg-[#1F2E22] px-3.5 py-2 rounded-xl border border-emerald-900/30 col-span-2 sm:col-span-1">
                        <span className="text-[9px] text-zinc-500 uppercase tracking-wider block mb-0.5">Price Trend</span>
                        <span className={`text-[10px] font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPositive ? '↑' : '↓'} {Math.abs(trend).toFixed(2)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] text-zinc-400 pt-1">
                      <div>
                        STATUS: <span className="text-[#EAB308] font-bold">{getDisplayStatus(inv.landStatus)}</span>
                      </div>
                      <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
                      <div>
                        WAITING PERIOD: <span className="text-white font-bold">{getWaitingPeriod(inv)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Qty and Sell CTA */}
                  <div className="flex items-center sm:flex-col justify-between sm:justify-center gap-3 sm:min-w-[7rem] border-t sm:border-t-0 sm:border-l border-emerald-900/30 pt-3 sm:pt-0 sm:pl-4">
                    <div className="text-left sm:text-center">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">Buyed Qty</span>
                      <span className="text-base font-black text-white">{inv.sharesOwned}</span>
                    </div>

                    {inv.status === 'active' && (
                      <button
                        onClick={() => handleSellClick(inv)}
                        className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-[11px] rounded-lg tracking-wider transition shadow-md shadow-rose-600/10"
                      >
                        SEL L
                      </button>
                    )}
                    
                    {inv.status === 'withdrawn' && (
                      <span className="px-3.5 py-1 bg-zinc-800 text-zinc-400 rounded text-[9px] uppercase font-bold tracking-wider">
                        SOLD
                      </span>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Sell Sheet Drawer Dialog */}
      {sellModalOpen && selectedInv && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#243527] border border-emerald-800/40 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex justify-between items-center pb-2 border-b border-emerald-900/40">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>🔻</span> SELL STOCK
              </h3>
              <button
                onClick={() => setSellModalOpen(false)}
                className="text-zinc-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
                <div>
                  STOCK ID: <span className="text-white font-mono font-bold">#{selectedInv._id.substring(selectedInv._id.length - 4).toUpperCase()}</span>
                </div>
                <div>
                  STOCK NAME: <span className="text-white font-bold uppercase">{selectedInv.projectName}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-[#1F2E22] p-3 rounded-xl border border-emerald-900/30">
                  <span className="text-zinc-500 block mb-0.5">Buyed Qty:</span>
                  <span className="font-extrabold text-white">{selectedInv.sharesOwned}</span>
                </div>
                <div className="bg-[#1F2E22] p-3 rounded-xl border border-emerald-900/30">
                  <span className="text-zinc-500 block mb-0.5">Buyed Price:</span>
                  <span className="font-bold text-zinc-300">₹{Math.round(selectedInv.investmentAmount / selectedInv.sharesOwned)}</span>
                </div>
                <div className="bg-[#1F2E22] p-3 rounded-xl border border-emerald-900/30 col-span-2 sm:col-span-1">
                  <span className="text-zinc-500 block mb-0.5">Current Value:</span>
                  <span className="font-bold text-emerald-300">₹{selectedInv.currentPrice}</span>
                </div>
              </div>

              {/* Stepper for Qty to Sell */}
              <div className="bg-[#1F2E22] p-4 rounded-xl border border-emerald-900/30 flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-300">SELL QUANTITY</span>
                <div className="flex items-center bg-[#152016] rounded-lg overflow-hidden border border-emerald-900/40">
                  <button
                    onClick={() => setSellQuantity(Math.max(1, sellQuantity - 1))}
                    className="px-3 py-1 hover:bg-[#1A251C] text-zinc-200 transition font-bold"
                  >
                    −
                  </button>
                  <span className="px-4 py-1 font-black text-white text-sm min-w-[2.5rem] text-center">
                    {sellQuantity}
                  </span>
                  <button
                    onClick={() => setSellQuantity(Math.min(selectedInv.sharesOwned, sellQuantity + 1))}
                    className="px-3 py-1 hover:bg-[#1A251C] text-zinc-200 transition font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs font-bold text-zinc-400">TOTAL PRICE</span>
                <span className="text-lg font-black text-emerald-300">
                  ₹{(sellQuantity * selectedInv.currentPrice).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleConfirmSell}
              disabled={selling}
              className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-black text-sm rounded-xl transition duration-200 disabled:opacity-50 shadow-md shadow-rose-600/15"
            >
              {selling ? 'PROCESSING...' : 'Sell Stock'}
            </button>
          </div>
        </div>
      )}

      {/* Sell Success overlay from Figma layout */}
      {sellSuccessOpen && (
        <div className="fixed inset-0 z-50 bg-[#1A251C] flex flex-col items-center justify-center p-6 text-center space-y-8 animate-fade-in">
          {/* Animated checkmark icon */}
          <div className="relative w-20 h-20 bg-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-rose-600/30">
            <span className="text-white text-4xl">✓</span>
            {/* Pulsing circles */}
            <div className="absolute inset-0 rounded-full bg-rose-600 animate-ping opacity-25"></div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-black text-white uppercase tracking-widest">Successfully Selled</h2>
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider max-w-xs mx-auto leading-relaxed">
              Your amount is added to your Agri Trade Wallet
            </p>
          </div>

          <button
            onClick={() => setSellSuccessOpen(false)}
            className="px-10 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl tracking-wider transition shadow-md shadow-rose-600/15"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
