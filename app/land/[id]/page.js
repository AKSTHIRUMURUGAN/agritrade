'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import PriceLineChart from '../../../components/PriceLineChart';
import BadgeRow from '../../../components/BadgeRow';

export default function LandDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [land, setLand] = useState(null);
  const [userInvestments, setUserInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stocksToBuy, setStocksToBuy] = useState(1);
  const [investing, setInvesting] = useState(false);
  
  // Sell flow state
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [sellQuantity, setSellQuantity] = useState(1);
  const [selling, setSelling] = useState(false);

  const fetchLand = useCallback(async () => {
    try {
      const res = await fetch(`/api/land/${params.id}`);
      if (!res.ok) throw new Error('Failed to fetch land');
      const data = await res.json();
      setLand(data.land);
      setStocksToBuy(data.land?.minimumStock || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

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
    if (params.id) {
      fetchLand();
    }
  }, [params.id, fetchLand]);

  useEffect(() => {
    if (user?.id) {
      fetchUserInvestments();
    }
  }, [user, fetchUserInvestments]);

  // Check if user owns active stock for this land
  const activeInvestment = userInvestments.find(
    (inv) => inv.projectId === params.id && inv.projectType === 'land' && inv.status === 'active'
  );

  const handleInvest = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (stocksToBuy < land.minimumStock) {
      alert(`Minimum ${land.minimumStock} stocks required`);
      return;
    }

    setInvesting(true);
    try {
      const totalAmount = stocksToBuy * land.perStockPrice;

      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount }),
      });
      const order = await orderRes.json();

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: 'AgriTrade',
          description: `Investment in ${land.landName}`,
          order_id: order.id,
          handler: async (response) => {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              // Record investment in DB
              const recordRes = await fetch('/api/investment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  projectId: land._id,
                  userId: user.id,
                  userName: user.name || user.email,
                  amount: totalAmount,
                  sharesOwned: stocksToBuy,
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                }),
              });
              const recordData = await recordRes.json();
              if (recordData.success) {
                alert('Investment successful!');
                fetchLand();
                fetchUserInvestments();
              } else {
                alert('Payment verified, but failed to save investment log.');
              }
            } else {
              alert('Payment verification failed.');
            }
          },
          prefill: { name: user.name || '', email: user.email || '' },
          theme: { color: '#059669' },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      };
    } catch (error) {
      console.error(error);
      alert('Failed to process investment.');
    } finally {
      setInvesting(false);
    }
  };

  const handleSellTrigger = () => {
    if (!activeInvestment) {
      alert('You do not own any active stock of this land to sell.');
      return;
    }
    
    // In Figma, cannot sell unless status is completed
    if (land.status !== 'completed') {
      alert('⚠️ Unable to sell the product. Please wait until the status is completed.');
      return;
    }

    setSellQuantity(1);
    setSellModalOpen(true);
  };

  const handleConfirmSell = async () => {
    if (sellQuantity > activeInvestment.sharesOwned) {
      alert('Cannot sell more shares than you currently own.');
      return;
    }

    setSelling(true);
    try {
      const res = await fetch('/api/investment', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: land._id,
          userId: user.id,
          investmentId: activeInvestment._id,
          sharesToSell: sellQuantity,
          sellPrice: land.currentAmount || land.perStockPrice,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Stock sold successfully!');
        setSellModalOpen(false);
        fetchLand();
        fetchUserInvestments();
      } else {
        alert(data.error || 'Failed to sell stock.');
      }
    } catch (error) {
      console.error('Error selling stock:', error);
      alert('An error occurred during transaction.');
    } finally {
      setSelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1F2E22] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!land) {
    return (
      <div className="min-h-screen bg-[#1A251C] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-zinc-500 text-lg mb-4">Land not found</p>
          <Link href="/land" className="text-emerald-400 hover:underline">← Back to Lands</Link>
        </div>
      </div>
    );
  }

  // Calculate Price Trend Percentage
  const prevPrice = land.previousAmount || land.perStockPrice || 0;
  const currPrice = land.currentAmount || land.perStockPrice || 0;
  const trend = prevPrice > 0 ? ((currPrice - prevPrice) / prevPrice) * 100 : 0.84;
  const isPositive = trend >= 0;

  // Prepare price data for chart
  const chartAmounts = [...(land.previousAmounts || [])];
  if (land.currentAmount && !chartAmounts.includes(land.currentAmount)) {
    chartAmounts.push(land.currentAmount);
  }
  if (chartAmounts.length === 0) {
    chartAmounts.push(land.perStockPrice);
  }

  return (
    <div className="min-h-screen bg-[#1A251C] text-zinc-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/land" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 font-bold mb-6 gap-2">
          ← Back to Lands
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel: Detailed Land Display */}
          <div className="lg:col-span-7 space-y-6">
            {/* Header image & Status */}
            <div className="bg-[#243527] border border-emerald-800/30 rounded-3xl overflow-hidden shadow-lg">
              {land.landImage ? (
                <img src={land.landImage} alt={land.landName} className="w-full h-72 object-cover" />
              ) : (
                <div className="w-full h-72 bg-gradient-to-br from-emerald-900/60 to-[#1F2E22] flex items-center justify-center">
                  <span className="text-7xl text-zinc-600">🏞️</span>
                </div>
              )}
              
              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl font-black text-white tracking-wide">{land.landName}</h1>
                    <p className="text-sm text-zinc-400 mt-1">📍 {land.landPlace}</p>
                  </div>
                  
                  {/* Status Badges */}
                  <div className="flex gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/30">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Status: {land.status}
                    </span>
                    {land.assured && (
                      <span className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-purple-950 text-purple-400 border border-purple-800/30">
                        🛡️ Assured
                      </span>
                    )}
                  </div>
                </div>

                {land.landDescription && (
                  <p className="text-sm text-zinc-300 leading-relaxed bg-[#1F2E22]/60 p-4 rounded-2xl border border-emerald-900/30">
                    {land.landDescription}
                  </p>
                )}
              </div>
            </div>

            {/* Key Specs Card */}
            <div className="bg-[#243527] border border-emerald-800/30 rounded-3xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">📊</span>
                <h2 className="text-lg font-bold text-white tracking-wide">Key Metrics</h2>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-[#1F2E22] p-4 rounded-2xl border border-emerald-900/30">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">Total Stock</span>
                  <span className="text-base font-extrabold text-white">{land.totalStock}</span>
                </div>
                <div className="bg-[#1F2E22] p-4 rounded-2xl border border-emerald-900/30">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">Min. Stock Required</span>
                  <span className="text-base font-extrabold text-white">{land.minimumStock}</span>
                </div>
                <div className="bg-[#1F2E22] p-4 rounded-2xl border border-emerald-900/30">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">Per Stock Price</span>
                  <span className="text-base font-extrabold text-emerald-300">₹{land.perStockPrice}</span>
                </div>
                <div className="bg-[#1F2E22] p-4 rounded-2xl border border-emerald-900/30">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">Duration</span>
                  <span className="text-base font-extrabold text-white">{land.duration} months</span>
                </div>
                <div className="bg-[#1F2E22] p-4 rounded-2xl border border-emerald-900/30">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">P/L Target</span>
                  <span className="text-base font-extrabold text-emerald-300">+{land.profitLossPercentage || 18}%</span>
                </div>
                <div className="bg-[#1F2E22] p-4 rounded-2xl border border-emerald-900/30">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">Years in Market</span>
                  <span className="text-base font-extrabold text-white">{land.yearsStayInMarket || 1} yrs</span>
                </div>
              </div>
            </div>

            {/* Stepper Purchase Selector */}
            <div className="bg-[#243527] border border-emerald-800/30 rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🛒</span>
                  <h2 className="text-lg font-bold text-white tracking-wide">Select Stocks</h2>
                </div>
                <span className="text-xs text-zinc-400">Available: {land.totalStock} stocks</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#1F2E22] p-4 rounded-2xl border border-emerald-900/30">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-zinc-300">Stock Count:</span>
                  <div className="flex items-center bg-[#152016] rounded-xl overflow-hidden border border-emerald-900/40">
                    <button
                      onClick={() => setStocksToBuy(Math.max(land.minimumStock || 1, stocksToBuy - 1))}
                      className="px-4 py-2 hover:bg-[#1A251C] text-zinc-200 transition font-bold"
                    >
                      −
                    </button>
                    <span className="px-5 py-2 font-black text-white text-sm min-w-[3rem] text-center">
                      {stocksToBuy}
                    </span>
                    <button
                      onClick={() => setStocksToBuy(Math.min(land.totalStock || 1000, stocksToBuy + 1))}
                      className="px-4 py-2 hover:bg-[#1A251C] text-zinc-200 transition font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 block uppercase tracking-wider">Total Amount</span>
                  <span className="text-2xl font-black text-emerald-300">₹{(stocksToBuy * land.perStockPrice).toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <button
                  onClick={handleInvest}
                  disabled={investing}
                  className="w-full py-4 text-center bg-[#EAB308] hover:bg-[#D9A307] text-zinc-950 font-black text-sm rounded-xl transition duration-200 disabled:opacity-50 shadow-md shadow-[#EAB308]/10"
                >
                  {investing ? 'PROCESSING...' : 'BUY STOCK'}
                </button>
                <button
                  onClick={handleSellTrigger}
                  className="w-full py-4 text-center bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl transition duration-200 shadow-md shadow-rose-600/10"
                >
                  SELL STOCK
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Stock Preview Dashboard */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#243527] border border-emerald-800/30 rounded-3xl p-6 shadow-lg sticky top-6">
              <h2 className="text-xl font-black text-white tracking-wide mb-4 border-b border-emerald-900/40 pb-3">
                Stock Preview
              </h2>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">Target Asset</span>
                  <span className="text-base font-bold text-white block">{land.landName}</span>
                </div>

                {/* SVG line chart */}
                <div>
                  <PriceLineChart amounts={chartAmounts} />
                </div>

                {/* Badges Grid */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Verification Badges</span>
                  <BadgeRow
                    soilTest={land.soilTest}
                    kycVerified={land.kycVerified}
                    documentVerified={land.documentVerified}
                    ranking={land.ranking}
                  />
                </div>

                {/* Details Breakdown */}
                <div className="bg-[#1F2E22] p-4 rounded-2xl border border-emerald-900/30 space-y-2.5 text-xs text-zinc-300">
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-medium">Selected Quantity:</span>
                    <span className="font-extrabold text-white">{stocksToBuy} shares</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-medium">Price per Share:</span>
                    <span className="font-bold text-emerald-300">₹{land.perStockPrice}</span>
                  </div>
                  <div className="flex justify-between border-t border-emerald-900/30 pt-2 text-sm">
                    <span className="text-zinc-400 font-bold">Total Price:</span>
                    <span className="font-black text-emerald-300">₹{stocksToBuy * land.perStockPrice}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#2d402f] pt-2 text-xs">
                    <span className="text-zinc-500 font-medium">Seed variety to plant:</span>
                    <span className="font-bold text-[#EAB308]">{land.seed || 'WEAT'}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-medium">Estimated Reward:</span>
                    <span className="font-black text-amber-400 flex items-center gap-1 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/30">
                      🪙 3 agri coin
                    </span>
                  </div>
                </div>

                {/* Active ownership helper */}
                {activeInvestment && (
                  <div className="bg-emerald-950/50 border border-emerald-800/40 p-4 rounded-2xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-emerald-400 font-bold block">You own this stock</span>
                      <span className="text-zinc-400 block mt-0.5">{activeInvestment.sharesOwned} shares currently active</span>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-900 text-emerald-300 rounded font-bold uppercase text-[9px]">
                      Active
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sell Modal / Sheet Dialog */}
      {sellModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#243527] border border-emerald-800/40 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-emerald-900/40">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>📈</span> Sell Stock
              </h3>
              <button
                onClick={() => setSellModalOpen(false)}
                className="text-zinc-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Asset Name</span>
                <span className="text-sm font-bold text-white">{land.landName}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#1F2E22] p-3 rounded-xl border border-emerald-900/30">
                  <span className="text-zinc-500 block mb-0.5">Owned Quantity:</span>
                  <span className="font-extrabold text-white">{activeInvestment.sharesOwned} shares</span>
                </div>
                <div className="bg-[#1F2E22] p-3 rounded-xl border border-emerald-900/30">
                  <span className="text-zinc-500 block mb-0.5">Current Stock Value:</span>
                  <span className="font-bold text-emerald-300">₹{land.currentAmount || land.perStockPrice}</span>
                </div>
              </div>

              {/* Sell Quantity Stepper */}
              <div className="bg-[#1F2E22] p-4 rounded-xl border border-emerald-900/30 flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-300">Quantity to Sell:</span>
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
                    onClick={() => setSellQuantity(Math.min(activeInvestment.sharesOwned, sellQuantity + 1))}
                    className="px-3 py-1 hover:bg-[#1A251C] text-zinc-200 transition font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs font-bold text-zinc-400">Total Return Price:</span>
                <span className="text-lg font-black text-emerald-300">
                  ₹{(sellQuantity * (land.currentAmount || land.perStockPrice)).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setSellModalOpen(false)}
                className="py-3 text-center bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSell}
                disabled={selling}
                className="py-3 text-center bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition disabled:opacity-50"
              >
                {selling ? 'PROCESSING...' : 'Sell Stock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
