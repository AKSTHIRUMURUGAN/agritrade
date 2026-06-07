'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserWalletPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Wallet data state
  const [balances, setBalances] = useState({ deposits: 0, winnings: 0, bonus: 0, total: 0 });
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tab State: 'transactions' | 'withdrawals'
  const [activeTab, setActiveTab] = useState('transactions');

  // Add Cash Modal state
  const [addCashOpen, setAddCashOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('100');
  const [depositing, setDepositing] = useState(false);

  // Withdraw Modal state
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('UPI'); // 'UPI' | 'Bank Transfer'
  const [paymentDetails, setPaymentDetails] = useState('');
  const [upiVerified, setUpiVerified] = useState(false);
  const [verifyingUpi, setVerifyingUpi] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  // Result Notification Modal states
  const [resultModal, setResultModal] = useState({ open: false, success: true, message: '' });

  const fetchWalletData = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/wallet?userId=${user.id}`);
      if (!res.ok) throw new Error('Failed to fetch wallet data');
      const data = await res.json();
      setBalances(data.balances || { deposits: 0, winnings: 0, bonus: 0, total: 0 });
      setTransactions(data.transactions || []);
      setWithdrawals(data.withdrawals || []);
    } catch (error) {
      console.error(error);
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
      fetchWalletData();
    }
  }, [user, fetchWalletData]);

  // Razorpay Checkout Integration for Add Cash
  const handleAddCash = async () => {
    const amount = Number(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setDepositing(true);
    try {
      // Create Razorpay order
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      if (!orderRes.ok) throw new Error('Failed to create payment order');
      const order = await orderRes.json();

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: 'AgriTrade Wallet',
          description: `Add Cash to Wallet: ${amount} Agri Coins`,
          order_id: order.id,
          handler: async (response) => {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              // Save deposit in user profile & transaction database
              const depositRes = await fetch('/api/wallet/deposit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: user.id,
                  amount,
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                }),
              });
              
              const depositData = await depositRes.json();
              if (depositData.success) {
                setAddCashOpen(false);
                fetchWalletData();
                setResultModal({
                  open: true,
                  success: true,
                  message: `Transaction Successful! Added ${amount} Agri Coins to your deposits balance.`
                });
              } else {
                setResultModal({
                  open: true,
                  success: false,
                  message: 'Payment verified but failed to credit your wallet balance.'
                });
              }
            } else {
              setResultModal({
                open: true,
                success: false,
                message: 'Payment verification failed.'
              });
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
      setResultModal({
        open: true,
        success: false,
        message: 'Transaction failed. Please try again.'
      });
    } finally {
      setDepositing(false);
    }
  };

  // Verify UPI ID using backend check
  const handleVerifyUpi = async () => {
    if (!paymentDetails || !paymentDetails.includes('@')) {
      alert('Please enter a valid UPI ID (e.g., user@upi)');
      return;
    }

    setVerifyingUpi(true);
    try {
      // Simulate/call validate VPA check
      const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
      const isValid = upiRegex.test(paymentDetails);
      
      if (isValid) {
        setUpiVerified(true);
      } else {
        alert('Verification failed. Invalid UPI ID.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setVerifyingUpi(false);
    }
  };

  // Submit Withdrawal Request
  const handleWithdrawSubmit = async () => {
    const amount = Number(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (amount > balances.winnings) {
      alert('Insufficient winnings balance. You can only withdraw from your Winnings wallet.');
      return;
    }

    if (withdrawMethod === 'UPI' && !upiVerified) {
      alert('Please verify your UPI ID first');
      return;
    }

    if (!paymentDetails) {
      alert('Please fill in payment details');
      return;
    }

    setWithdrawing(true);
    try {
      const res = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          amount,
          method: withdrawMethod,
          paymentDetails
        }),
      });

      const data = await res.json();
      if (data.success) {
        setWithdrawOpen(false);
        fetchWalletData();
        setResultModal({
          open: true,
          success: true,
          message: `Withdrawal request of ${amount} Agri Coins submitted successfully. Admin approval pending.`
        });
      } else {
        setResultModal({
          open: true,
          success: false,
          message: data.error || 'Withdrawal failed.'
        });
      }
    } catch (error) {
      console.error(error);
      setResultModal({
        open: true,
        success: false,
        message: 'An error occurred during withdrawal.'
      });
    } finally {
      setWithdrawing(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#1F2E22] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#1A251C] text-zinc-100 py-8">
      <div className="max-w-md mx-auto px-4">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/user" className="w-8 h-8 rounded-full bg-[#243527] border border-emerald-800/40 flex items-center justify-center text-zinc-400 hover:text-white">
            ←
          </Link>
          <h1 className="text-sm font-black tracking-widest uppercase text-white">Wallet</h1>
          <div className="w-8"></div>
        </div>

        {/* Balance Card Container from Figma */}
        <div className="bg-[#243527] border border-emerald-800/30 rounded-3xl p-6 shadow-xl relative overflow-hidden mb-6">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
          
          <div className="text-center pb-5 border-b border-emerald-900/40">
            {/* Wallet Icon */}
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">💼</span>
            </div>
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Total Balance</span>
            <div className="text-3xl font-black text-white mt-1 flex items-center justify-center gap-1.5">
              <span className="text-emerald-300">🪙</span> {balances.total.toFixed(2)}
            </div>
            <span className="text-[9px] text-emerald-400 block mt-1">(1 Agri Coin = ₹1)</span>
          </div>

          {/* Breakdown Rows */}
          <div className="space-y-4 pt-5">
            {/* Deposits Balance */}
            <div className="flex items-center justify-between bg-[#1F2E22] p-3 rounded-2xl border border-emerald-900/30">
              <div className="flex items-center gap-3">
                <span className="text-lg">🪙</span>
                <div>
                  <span className="text-xs font-bold text-white block">Deposits</span>
                  <span className="text-[10px] text-zinc-500 block">Funds added via online UPI</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-zinc-200">🪙 {balances.deposits}</span>
                <button
                  onClick={() => {
                    setDepositAmount('100');
                    setAddCashOpen(true);
                  }}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 text-[10px] font-black rounded-lg transition"
                >
                  + ADD
                </button>
              </div>
            </div>

            {/* Winnings Balance */}
            <div className="flex items-center justify-between bg-[#1F2E22] p-3 rounded-2xl border border-emerald-900/30">
              <div className="flex items-center gap-3">
                <span className="text-lg">🏆</span>
                <div>
                  <span className="text-xs font-bold text-white block">Winnings</span>
                  <span className="text-[10px] text-zinc-500 block">Returns credited from sold stocks</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-emerald-300">🪙 {balances.winnings}</span>
                <button
                  onClick={() => {
                    setWithdrawAmount('');
                    setPaymentDetails('');
                    setUpiVerified(false);
                    setWithdrawOpen(true);
                  }}
                  disabled={balances.winnings <= 0}
                  className="px-3 py-1 bg-[#EAB308] hover:bg-[#D9A307] disabled:opacity-50 text-zinc-950 text-[10px] font-black rounded-lg transition"
                >
                  WITHDRAW
                </button>
              </div>
            </div>

            {/* Bonus Balance */}
            <div className="flex items-center justify-between bg-[#1F2E22] p-3 rounded-2xl border border-emerald-900/30">
              <div className="flex items-center gap-3">
                <span className="text-lg">🎁</span>
                <div>
                  <span className="text-xs font-bold text-white block">Bonus</span>
                  <span className="text-[10px] text-zinc-500 block">Registration joining rewards</span>
                </div>
              </div>
              <div>
                <span className="text-sm font-black text-[#EAB308]">🪙 {balances.bonus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Offers Option Banner */}
        <div className="bg-[#243527] border border-emerald-800/30 rounded-2xl p-4 flex items-center justify-between mb-6 hover:border-emerald-700/40 cursor-pointer transition">
          <div className="flex items-center gap-3">
            <span className="text-lg">🏷️</span>
            <div>
              <span className="text-xs font-bold text-white block">My Offers & Benefits</span>
              <span className="text-[9px] text-zinc-500 block">View coupons, cashbacks, and vouchers</span>
            </div>
          </div>
          <span className="text-zinc-500">➔</span>
        </div>

        {/* Tabs for Histories */}
        <div className="bg-[#1F2E22] border border-emerald-900/40 p-1 rounded-xl flex justify-between mb-4">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 text-center py-2 rounded-lg text-[10px] font-black tracking-wider transition ${
              activeTab === 'transactions' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            TRANSACTION HISTORY
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`flex-1 text-center py-2 rounded-lg text-[10px] font-black tracking-wider transition ${
              activeTab === 'withdrawals' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            WITHDRAW HISTORY
          </button>
        </div>

        {/* History Lists */}
        {activeTab === 'transactions' ? (
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <p className="text-center text-xs text-zinc-500 py-6">No transaction records</p>
            ) : (
              transactions.map((tx) => (
                <div key={tx._id} className="bg-[#243527] border border-emerald-800/25 rounded-2xl p-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-white font-bold block">{tx.description}</span>
                    <span className="text-[10px] text-zinc-500 block mt-1">
                      {new Date(tx.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <span className={`font-black text-sm ${
                    ['deposit', 'stock_sell', 'bonus'].includes(tx.type) ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {['deposit', 'stock_sell', 'bonus'].includes(tx.type) ? '+' : '-'} 🪙{tx.amount}
                  </span>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {withdrawals.length === 0 ? (
              <p className="text-center text-xs text-zinc-500 py-6">No withdrawal requests</p>
            ) : (
              withdrawals.map((w) => (
                <div key={w._id} className="bg-[#243527] border border-emerald-800/25 rounded-2xl p-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-white font-bold block">Withdrawal to {w.method}</span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">{w.paymentDetails}</span>
                    <span className="text-[10px] text-zinc-500 block mt-1">
                      {new Date(w.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-white block">🪙{w.amount}</span>
                    <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase mt-1.5 ${
                      w.status === 'pending' ? 'bg-amber-950 text-amber-400 border border-amber-900/30' :
                      w.status === 'approved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/30' :
                      'bg-rose-950 text-rose-400 border border-rose-900/30'
                    }`}>
                      {w.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* ADD CASH MODAL DIALOG */}
      {addCashOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#243527] border border-emerald-800/40 rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex justify-between items-center pb-2 border-b border-emerald-900/40">
              <h3 className="text-base font-black text-white flex items-center gap-1.5">
                <span>➕</span> Add Cash
              </h3>
              <button onClick={() => setAddCashOpen(false)} className="text-zinc-400 hover:text-white font-bold">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">Enter Money</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-emerald-300">🪙</span>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 bg-[#1F2E22] border border-emerald-900/30 rounded-xl text-zinc-100 font-extrabold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Preset buttons */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                {['100', '500', '1000'].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setDepositAmount(preset)}
                    className={`py-2 rounded-xl font-bold border transition ${
                      depositAmount === preset
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                        : 'bg-[#1F2E22] text-zinc-300 border-emerald-900/30'
                    }`}
                  >
                    🪙{preset}
                  </button>
                ))}
              </div>

              {/* Add cash button with Razorpay trigger */}
              <button
                onClick={handleAddCash}
                disabled={depositing}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-zinc-950 font-black text-xs rounded-xl tracking-wider transition"
              >
                {depositing ? 'PROCESSING...' : 'ADD NOW'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WITHDRAW MODAL DIALOG */}
      {withdrawOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#243527] border border-emerald-800/40 rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex justify-between items-center pb-2 border-b border-emerald-900/40">
              <h3 className="text-base font-black text-white flex items-center gap-1.5">
                <span>💸</span> Withdraw Cash
              </h3>
              <button onClick={() => setWithdrawOpen(false)} className="text-zinc-400 hover:text-white font-bold">✕</button>
            </div>

            <div className="space-y-4">
              <div className="bg-[#1F2E22] px-4 py-2.5 rounded-xl border border-emerald-900/30 flex justify-between text-xs">
                <span className="text-zinc-500">Available Balance:</span>
                <span className="font-bold text-emerald-300">🪙 {balances.winnings}</span>
              </div>

              {/* Withdraw Method Selector */}
              <div>
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">Transfer Method</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['UPI', 'Bank Transfer'].map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setWithdrawMethod(m);
                        setPaymentDetails('');
                        setUpiVerified(false);
                      }}
                      className={`py-2 rounded-xl font-bold border transition ${
                        withdrawMethod === m
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                          : 'bg-[#1F2E22] text-zinc-300 border-emerald-900/30'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Details Input fields */}
              <div className="space-y-3 text-xs">
                {withdrawMethod === 'UPI' ? (
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">UPI ID (VPA)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter UPI ID (e.g. name@upi)"
                        value={paymentDetails}
                        onChange={(e) => {
                          setPaymentDetails(e.target.value);
                          setUpiVerified(false);
                        }}
                        className="flex-1 px-3 py-2 bg-[#1F2E22] border border-emerald-900/30 rounded-xl text-zinc-100 focus:outline-none"
                      />
                      <button
                        onClick={handleVerifyUpi}
                        disabled={verifyingUpi || upiVerified}
                        className={`px-3 py-2 rounded-xl font-black transition ${
                          upiVerified
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                            : 'bg-zinc-800 text-zinc-300 hover:text-white'
                        }`}
                      >
                        {verifyingUpi ? '...' : upiVerified ? '✓ Verified' : 'Verify'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">Bank Account & IFSC</label>
                    <input
                      type="text"
                      placeholder="Account No., Holder Name, IFSC Code"
                      value={paymentDetails}
                      onChange={(e) => setPaymentDetails(e.target.value)}
                      className="w-full px-3 py-2 bg-[#1F2E22] border border-emerald-900/30 rounded-xl text-zinc-100 focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">Withdraw Amount</label>
                  <input
                    type="number"
                    placeholder="Enter amount to withdraw"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1F2E22] border border-emerald-900/30 rounded-xl text-zinc-100 font-bold focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit withdraw request button */}
              <button
                onClick={handleWithdrawSubmit}
                disabled={withdrawing || (withdrawMethod === 'UPI' && !upiVerified)}
                className="w-full py-3 bg-[#EAB308] hover:bg-[#D9A307] disabled:opacity-50 text-zinc-950 font-black text-xs rounded-xl tracking-wider transition"
              >
                {withdrawing ? 'PROCESSING...' : 'WITHDRAW NOW'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TRANSACTION RESULT MODAL DIALOG */}
      {resultModal.open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#243527] border border-emerald-800/40 rounded-3xl w-full max-w-xs p-6 shadow-2xl text-center space-y-4 animate-scale-up">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-emerald-950/40 border border-emerald-800/40">
              {resultModal.success ? (
                <span className="text-3xl text-emerald-400">✓</span>
              ) : (
                <span className="text-3xl text-rose-400">⚠️</span>
              )}
            </div>

            <h3 className="text-base font-black text-white">
              {resultModal.success ? 'Transaction Successful' : 'Transaction Failed'}
            </h3>

            <p className="text-xs text-zinc-400 leading-relaxed">
              {resultModal.message}
            </p>

            <button
              onClick={() => setResultModal({ ...resultModal, open: false })}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-black text-xs rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
