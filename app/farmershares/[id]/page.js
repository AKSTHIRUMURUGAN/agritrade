'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

export default function FarmerShareDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [share, setShare] = useState(null);
  const [loading, setLoading] = useState(true);
  const [investing, setInvesting] = useState(false);
  const [sharesToBuy, setSharesToBuy] = useState(1);
  const [showInvestModal, setShowInvestModal] = useState(false);

  useEffect(() => {
    if (params.id) fetchShare();
  }, [params.id]);

  const fetchShare = async () => {
    try {
      const res = await fetch(`/api/farmershare/${params.id}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setShare(data.farmerShare);
      setSharesToBuy(data.farmerShare?.minimumShares || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (sharesToBuy < share.minimumShares) {
      alert(`Minimum ${share.minimumShares} shares required`);
      return;
    }

    setInvesting(true);
    try {
      const totalAmount = sharesToBuy * share.pricePerShare;

      // Create Razorpay order
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount }),
      });
      const order = await orderRes.json();

      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: 'AgriTrade',
          description: `Investment in ${share.farmerName}'s ${share.cropType} farm`,
          order_id: order.id,
          handler: async (response) => {
            // Verify payment
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              // Record investment
              await fetch('/api/farmershare/invest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  farmerShareId: params.id,
                  userId: user.id,
                  userName: user.name || user.email,
                  sharesOwned: sharesToBuy,
                }),
              });
              alert('Investment successful! Welcome to the farm.');
              setShowInvestModal(false);
              fetchShare();
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          },
          prefill: {
            name: user.name || '',
            email: user.email || '',
          },
          theme: { color: '#16a34a' },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };
    } catch (error) {
      console.error('Investment error:', error);
      alert('Failed to process investment. Please try again.');
    } finally {
      setInvesting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!share) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Farmer share not found</p>
          <Link href="/farmershares" className="text-green-600 hover:underline">← Back to opportunities</Link>
        </div>
      </div>
    );
  }

  const fundingPercent = Math.round(((share.totalShares - share.availableShares) / share.totalShares) * 100);
  const totalCost = sharesToBuy * share.pricePerShare;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <Link href="/farmershares" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
          ← Back to Opportunities
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{share.farmerName}</h1>
                  <p className="text-gray-500 mt-1">📍 {share.farmLocation}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                    share.status === 'open' ? 'bg-green-100 text-green-800' :
                    share.status === 'funding' ? 'bg-blue-100 text-blue-800' :
                    share.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    share.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {share.status}
                  </span>
                  {share.assured && (
                    <span className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-800 font-medium">
                      ✓ Assured Returns
                    </span>
                  )}
                </div>
              </div>

              {/* Funding Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Funding Progress</span>
                  <span className="font-semibold text-green-600">{fundingPercent}% funded</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all"
                    style={{ width: `${fundingPercent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹{share.totalInvestmentRaised?.toLocaleString()} raised</span>
                  <span>₹{(share.totalShares * share.pricePerShare)?.toLocaleString()} target</span>
                </div>
              </div>

              {share.description && (
                <p className="text-gray-700 leading-relaxed">{share.description}</p>
              )}
            </div>

            {/* Farm Details */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Farm Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <DetailItem icon="🌾" label="Crop Type" value={share.cropType} />
                <DetailItem icon="📐" label="Farm Size" value={`${share.farmSize || 'N/A'} acres`} />
                <DetailItem icon="🌱" label="Farming Method" value={share.farmingMethod} />
                <DetailItem icon="⏱️" label="Duration" value={`${share.duration} months`} />
                <DetailItem icon="🌿" label="Seed Variety" value={share.seedVariety || 'N/A'} />
                <DetailItem icon="📅" label="Harvest Date" value={share.harvestDate ? new Date(share.harvestDate).toLocaleDateString() : 'TBD'} />
              </div>
            </div>

            {/* Verification */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Trust & Verification</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <VerificationBadge label="KYC Verified" verified={share.kycVerified} />
                <VerificationBadge label="Documents" verified={share.documentVerified} />
                <VerificationBadge label="Soil Test" verified={share.soilTestReport} />
                <VerificationBadge label="Land Ownership" verified={share.landOwnershipVerified} />
                <VerificationBadge label="Govt. Approved" verified={share.governmentApproved} />
                <VerificationBadge label="Insurance" verified={share.insuranceCovered} />
              </div>
            </div>

            {/* Risk Factors */}
            {share.riskFactors && share.riskFactors.length > 0 && (
              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Risk Factors</h2>
                <ul className="space-y-2">
                  {share.riskFactors.map((risk, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="text-yellow-500 mt-0.5">⚠️</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Milestones */}
            {share.milestones && share.milestones.length > 0 && (
              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Project Milestones</h2>
                <div className="space-y-3">
                  {share.milestones.map((milestone, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        milestone.completed ? 'bg-green-500' : 'bg-gray-200'
                      }`}>
                        {milestone.completed ? (
                          <span className="text-white text-xs">✓</span>
                        ) : (
                          <span className="text-gray-400 text-xs">{i + 1}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{milestone.title}</p>
                        <p className="text-sm text-gray-500">{milestone.description}</p>
                        {milestone.date && (
                          <p className="text-xs text-gray-400">{new Date(milestone.date).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Investors Table */}
            {share.investors && share.investors.length > 0 && (
              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Investors ({share.investors.length})
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Investor</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shares</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {share.investors.map((investor, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{investor.userName}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{investor.sharesOwned}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">₹{investor.investmentAmount?.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {new Date(investor.investmentDate).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Investment Card */}
            <div className="bg-white rounded-2xl shadow p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Invest Now</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per Share</span>
                  <span className="font-bold text-green-600">₹{share.pricePerShare?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Shares</span>
                  <span className="font-semibold">{share.availableShares}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Min. Shares</span>
                  <span className="font-semibold">{share.minimumShares}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expected Return</span>
                  <span className="font-bold text-green-600">{share.expectedReturn}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Farmer Rating</span>
                  <span className="font-semibold">{'⭐'.repeat(share.ranking || 0)}</span>
                </div>
              </div>

              {share.availableShares > 0 && share.status === 'open' ? (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Shares
                    </label>
                    <input
                      type="number"
                      min={share.minimumShares}
                      max={share.availableShares}
                      value={sharesToBuy}
                      onChange={(e) => setSharesToBuy(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="bg-green-50 rounded-lg p-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Total Investment</span>
                      <span className="font-bold text-green-700 text-lg">₹{totalCost.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Est. return: ₹{Math.round(totalCost * (1 + (share.expectedReturn || 0) / 100)).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={handleInvest}
                    disabled={investing}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {investing ? 'Processing...' : `Invest ₹${totalCost.toLocaleString()}`}
                  </button>

                  {!user && (
                    <p className="text-xs text-center text-gray-500 mt-2">
                      <Link href="/login" className="text-green-600 hover:underline">Login</Link> to invest
                    </p>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 font-medium">
                    {share.availableShares === 0 ? 'Fully Funded' : 'Not accepting investments'}
                  </p>
                </div>
              )}
            </div>

            {/* Farmer Info */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About the Farmer</h2>
              <div className="space-y-3">
                {share.farmerExperience && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-semibold">{share.farmerExperience} years</span>
                  </div>
                )}
                {share.previousProjectsCompleted > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Projects Completed</span>
                    <span className="font-semibold">{share.previousProjectsCompleted}</span>
                  </div>
                )}
                {share.successRate > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-semibold text-green-600">{share.successRate}%</span>
                  </div>
                )}
                {share.farmerContact && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contact</span>
                    <span className="font-semibold">{share.farmerContact}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-xs text-gray-500 mb-1">{icon} {label}</p>
      <p className="font-semibold text-gray-900 capitalize">{value}</p>
    </div>
  );
}

function VerificationBadge({ label, verified }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
      verified ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-500'
    }`}>
      <span>{verified ? '✅' : '⬜'}</span>
      <span>{label}</span>
    </div>
  );
}
