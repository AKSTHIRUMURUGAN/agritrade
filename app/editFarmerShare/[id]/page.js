'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UploadButton } from '../../../src/utils/uploadthing';
import Image from 'next/image';

export default function EditFarmerSharePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(null);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [distributing, setDistributing] = useState(false);

  useEffect(() => {
    if (params.id) fetchShare();
  }, [params.id]);

  const fetchShare = async () => {
    try {
      const res = await fetch(`/api/farmershare/${params.id}`);
      const data = await res.json();
      if (data.farmerShare) setFormData(data.farmerShare);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/farmershare/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          totalShares: Number(formData.totalShares),
          pricePerShare: Number(formData.pricePerShare),
          minimumShares: Number(formData.minimumShares),
          expectedReturn: Number(formData.expectedReturn),
          duration: Number(formData.duration),
          farmSize: Number(formData.farmSize),
          farmerExperience: Number(formData.farmerExperience),
          ranking: Number(formData.ranking),
        }),
      });

      if (res.ok) {
        router.push('/admin/farmer-shares');
      } else {
        throw new Error('Failed to update');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update farmer share. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDistributePayout = async () => {
    const total = Number(payoutAmount);
    if (isNaN(total) || total < 0) {
      alert("Please enter a valid payout pool amount");
      return;
    }

    if (!confirm(`Are you sure you want to distribute a total return of ₹${total} among active investors? This action will close the project and cannot be undone.`)) {
      return;
    }

    setDistributing(true);
    try {
      const res = await fetch('/api/admin/farmershare/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerShareId: params.id,
          totalPayout: total
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message || "Payout distributed successfully!");
        router.push('/admin/farmer-shares');
      } else {
        alert(data.error || "Failed to distribute payout.");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred during distribution.");
    } finally {
      setDistributing(false);
    }
  };

  const activeInvestors = formData && formData.investors ? formData.investors.filter(inv => inv.status === 'active') : [];
  const totalActiveShares = activeInvestors.reduce((sum, inv) => sum + (inv.sharesOwned || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Farmer share not found.</p>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Farmer Share</h1>
            <p className="text-gray-500 mt-1">Update project details</p>
          </div>
          <button onClick={() => router.push('/admin/farmer-shares')} className="text-gray-600 hover:text-gray-900">← Back</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Farmer Info */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Farmer Information</h2>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Farmer Image</p>
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => setFormData(prev => ({ ...prev, farmerImage: res[0].url }))}
                onUploadError={(error) => alert(`Upload error: ${error.message}`)}
              />
              {formData.farmerImage && (
                <img src={formData.farmerImage} alt="Farmer" className="mt-3 h-24 w-24 rounded-full object-cover" />
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Farmer Name *</label>
                <input type="text" name="farmerName" value={formData.farmerName || ''} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Farmer Location</label>
                <input type="text" name="farmerLocation" value={formData.farmerLocation || ''} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Contact</label>
                <input type="text" name="farmerContact" value={formData.farmerContact || ''} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Experience (years)</label>
                <input type="number" name="farmerExperience" value={formData.farmerExperience || ''} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Farm Details */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Farm Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Farm Name</label>
                <input type="text" name="farmName" value={formData.farmName || ''} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Farm Location *</label>
                <input type="text" name="farmLocation" value={formData.farmLocation || ''} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Crop Type *</label>
                <input type="text" name="cropType" value={formData.cropType || ''} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Seed Variety</label>
                <input type="text" name="seedVariety" value={formData.seedVariety || ''} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Farm Size (acres)</label>
                <input type="number" name="farmSize" value={formData.farmSize || ''} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Farming Method</label>
                <select name="farmingMethod" value={formData.farmingMethod || 'conventional'} onChange={handleChange} className={inputClass}>
                  <option value="conventional">Conventional</option>
                  <option value="organic">Organic</option>
                  <option value="hydroponic">Hydroponic</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Duration (months)</label>
                <input type="number" name="duration" value={formData.duration || ''} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select name="status" value={formData.status || 'open'} onChange={handleChange} className={inputClass}>
                  <option value="open">Open</option>
                  <option value="funding">Funding</option>
                  <option value="in-progress">In Progress</option>
                  <option value="harvesting">Harvesting</option>
                  <option value="completed">Completed</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Current Stage</label>
                <select name="stage" value={formData.stage || 'Preparation of soil'} onChange={handleChange} className={inputClass}>
                  <option value="Preparation of soil">Preparation of soil</option>
                  <option value="Sowing">Sowing</option>
                  <option value="Adding manures and fertilizer">Adding manures and fertilizer</option>
                  <option value="Irrigation">Irrigation</option>
                  <option value="Weeding">Weeding</option>
                  <option value="Harvesting">Harvesting</option>
                  <option value="Threshing">Threshing</option>
                  <option value="Storage">Storage</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Share & Financial */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Share & Financial Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Total Shares *</label>
                <input type="number" name="totalShares" value={formData.totalShares || ''} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Price per Share (₹) *</label>
                <input type="number" name="pricePerShare" value={formData.pricePerShare || ''} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Minimum Shares</label>
                <input type="number" name="minimumShares" value={formData.minimumShares || 1} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Expected Return (%)</label>
                <input type="number" name="expectedReturn" value={formData.expectedReturn || ''} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Ranking (1-5)</label>
                <input type="number" min="1" max="5" name="ranking" value={formData.ranking || 3} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Target Amount (₹)</label>
                <input type="number" name="targetAmount" value={formData.targetAmount || ''} onChange={handleChange} className={inputClass} />
              </div>
            </div>
            <div className="mt-4">
              <label className={labelClass}>Description</label>
              <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={3} className={inputClass} placeholder="Describe the farming project..." />
            </div>
          </div>

          {/* Verification */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Verification & Trust</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Document Verified", name: "documentVerified" },
                { label: "KYC Verified", name: "kycVerified" },
                { label: "Soil Test Report", name: "soilTestReport" },
                { label: "Land Ownership Verified", name: "landOwnershipVerified" },
                { label: "Government Approved", name: "governmentApproved" },
                { label: "Insurance Covered", name: "insuranceCovered" },
                { label: "Assured Returns", name: "assured" },
              ].map(({ label, name }) => (
                <label key={name} className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input type="checkbox" name={name} checked={formData[name] || false} onChange={handleChange} className="w-5 h-5 text-green-600 rounded" />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Payout Distribution Section */}
          {formData.status !== 'completed' && (
            <div className="bg-white rounded-2xl shadow p-6 border border-emerald-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span>💸</span> Distribute Payout (Profit/Loss Split)
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                Calculate and split final returns (profit or loss) proportionally among all active investors based on their shares owned. Completing this action will credit user wallets and mark the project as completed.
              </p>

              {totalActiveShares === 0 ? (
                <div className="bg-gray-50 text-gray-600 text-xs p-4 rounded-xl text-center">
                  ⚠️ No active investors found for this project. You cannot distribute payouts.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-xs text-green-800 space-y-1">
                    <div className="flex justify-between">
                      <span>Total Active Shares:</span>
                      <span className="font-bold">{totalActiveShares} shares</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Active Investors:</span>
                      <span className="font-bold">{activeInvestors.length} users</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 items-end">
                    <div>
                      <label className={labelClass}>Total Return Pool (Agri Coins) *</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 50000"
                        value={payoutAmount}
                        onChange={(e) => setPayoutAmount(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={handleDistributePayout}
                        disabled={distributing || !payoutAmount}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-sm transition disabled:opacity-50"
                      >
                        {distributing ? "Distributing..." : "Confirm & Distribute"}
                      </button>
                    </div>
                  </div>

                  {payoutAmount && Number(payoutAmount) >= 0 && (
                    <div className="border border-gray-150 rounded-xl overflow-hidden text-xs mt-3">
                      <div className="bg-gray-100 p-2 font-bold text-gray-700 uppercase tracking-wider">
                        Estimated Payout Distribution Breakdown
                      </div>
                      <div className="divide-y divide-gray-100 max-h-40 overflow-y-auto">
                        {activeInvestors.map((inv) => {
                          const proportion = inv.sharesOwned / totalActiveShares;
                          const calculatedPayout = Math.round(Number(payoutAmount) * proportion * 100) / 100;
                          return (
                            <div key={inv._id} className="p-2.5 flex justify-between items-center hover:bg-gray-50">
                              <div>
                                <span className="font-semibold text-gray-800 block">{inv.userName}</span>
                                <span className="text-[10px] text-gray-400 block">{inv.sharesOwned} shares ({Math.round(proportion * 100)}%)</span>
                              </div>
                              <span className="font-extrabold text-emerald-600">🪙 {calculatedPayout}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4">
            <button type="submit" disabled={submitting} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50">
              {submitting ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" onClick={() => router.push('/admin/farmer-shares')} className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
