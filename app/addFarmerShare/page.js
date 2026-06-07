'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadButton } from '../../src/utils/uploadthing';
import Image from 'next/image';

export default function AddFarmerShare() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Farmer Info
    farmerName: '',
    farmerImage: '',
    farmerLocation: '',
    farmerContact: '',
    farmerExperience: '',
    // Farm Details
    farmName: '',
    farmLocation: '',
    farmSize: '',
    cropType: '',
    seedVariety: '',
    farmingMethod: 'conventional',
    duration: '',
    // Share Info
    totalShares: '',
    pricePerShare: '',
    minimumShares: 1,
    expectedReturn: '',
    targetAmount: '',
    // Timeline
    projectStartDate: '',
    projectEndDate: '',
    harvestDate: '',
    // Performance
    ranking: 3,
    previousProjectsCompleted: 0,
    successRate: 0,
    // Trust
    documentVerified: false,
    kycVerified: false,
    soilTestReport: false,
    landOwnershipVerified: false,
    governmentApproved: false,
    insuranceCovered: false,
    assured: false,
    // Status & Description
    status: 'open',
    description: '',
  });

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
      const payload = {
        ...formData,
        totalShares: Number(formData.totalShares),
        availableShares: Number(formData.totalShares),
        pricePerShare: Number(formData.pricePerShare),
        minimumShares: Number(formData.minimumShares),
        expectedReturn: Number(formData.expectedReturn),
        duration: Number(formData.duration),
        farmSize: Number(formData.farmSize),
        farmerExperience: Number(formData.farmerExperience),
        ranking: Number(formData.ranking),
        previousProjectsCompleted: Number(formData.previousProjectsCompleted),
        successRate: Number(formData.successRate),
        targetAmount: formData.targetAmount ? Number(formData.targetAmount) : Number(formData.totalShares) * Number(formData.pricePerShare),
      };

      const res = await fetch('/api/farmershare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/admin/farmer-shares');
      } else {
        const err = await res.json();
        alert(`Error: ${err.message || 'Failed to create'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create farmer share. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const input = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent";
  const label = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add Farmer Share</h1>
            <p className="text-gray-500 mt-1">Create a new agricultural investment opportunity</p>
          </div>
          <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-900">← Back</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Farmer Information */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">👨‍🌾 Farmer Information</h2>

            <div className="mb-4">
              <p className={label}>Farmer Photo</p>
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => setFormData(p => ({ ...p, farmerImage: res[0].url }))}
                onUploadError={(err) => alert(`Upload error: ${err.message}`)}
              />
              {formData.farmerImage && (
                <img src={formData.farmerImage} alt="Farmer" className="mt-3 h-24 w-24 rounded-full object-cover border-2 border-green-200" />
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={label}>Farmer Name *</label>
                <input type="text" name="farmerName" value={formData.farmerName} onChange={handleChange} required className={input} placeholder="e.g. Ravi Kumar" />
              </div>
              <div>
                <label className={label}>Farmer Location</label>
                <input type="text" name="farmerLocation" value={formData.farmerLocation} onChange={handleChange} className={input} placeholder="e.g. Thanjavur, Tamil Nadu" />
              </div>
              <div>
                <label className={label}>Contact Number</label>
                <input type="text" name="farmerContact" value={formData.farmerContact} onChange={handleChange} className={input} placeholder="+91 9876543210" />
              </div>
              <div>
                <label className={label}>Years of Experience</label>
                <input type="number" name="farmerExperience" value={formData.farmerExperience} onChange={handleChange} className={input} placeholder="10" />
              </div>
              <div>
                <label className={label}>Previous Projects Completed</label>
                <input type="number" name="previousProjectsCompleted" value={formData.previousProjectsCompleted} onChange={handleChange} className={input} placeholder="3" />
              </div>
              <div>
                <label className={label}>Historical Success Rate (%)</label>
                <input type="number" name="successRate" value={formData.successRate} onChange={handleChange} className={input} placeholder="85" />
              </div>
            </div>
          </div>

          {/* Farm Details */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">🏡 Farm Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={label}>Farm Name</label>
                <input type="text" name="farmName" value={formData.farmName} onChange={handleChange} className={input} placeholder="e.g. Sunrise Tomato Farm" />
              </div>
              <div>
                <label className={label}>Farm Location *</label>
                <input type="text" name="farmLocation" value={formData.farmLocation} onChange={handleChange} required className={input} placeholder="e.g. Coimbatore, Tamil Nadu" />
              </div>
              <div>
                <label className={label}>Crop Type *</label>
                <input type="text" name="cropType" value={formData.cropType} onChange={handleChange} required className={input} placeholder="e.g. Tomato, Wheat, Cotton" />
              </div>
              <div>
                <label className={label}>Seed Variety</label>
                <input type="text" name="seedVariety" value={formData.seedVariety} onChange={handleChange} className={input} placeholder="e.g. Hybrid HT-1" />
              </div>
              <div>
                <label className={label}>Farm Size (acres)</label>
                <input type="number" name="farmSize" value={formData.farmSize} onChange={handleChange} className={input} placeholder="5" />
              </div>
              <div>
                <label className={label}>Farming Method</label>
                <select name="farmingMethod" value={formData.farmingMethod} onChange={handleChange} className={input}>
                  <option value="conventional">Conventional</option>
                  <option value="organic">Organic</option>
                  <option value="hydroponic">Hydroponic</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Share & Financial */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">💰 Share & Financial Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={label}>Total Shares *</label>
                <input type="number" name="totalShares" value={formData.totalShares} onChange={handleChange} required className={input} placeholder="40" />
              </div>
              <div>
                <label className={label}>Price per Share (₹) *</label>
                <input type="number" name="pricePerShare" value={formData.pricePerShare} onChange={handleChange} required className={input} placeholder="1000" />
              </div>
              <div>
                <label className={label}>Minimum Shares to Buy</label>
                <input type="number" name="minimumShares" value={formData.minimumShares} onChange={handleChange} className={input} placeholder="1" />
              </div>
              <div>
                <label className={label}>Expected Return (%) *</label>
                <input type="number" name="expectedReturn" value={formData.expectedReturn} onChange={handleChange} required className={input} placeholder="15" />
              </div>
              <div>
                <label className={label}>Target Amount (₹)</label>
                <input type="number" name="targetAmount" value={formData.targetAmount} onChange={handleChange} className={input} placeholder="Auto-calculated if empty" />
              </div>
              <div>
                <label className={label}>Duration (months) *</label>
                <input type="number" name="duration" value={formData.duration} onChange={handleChange} required className={input} placeholder="6" />
              </div>
              <div>
                <label className={label}>Ranking (1-5)</label>
                <select name="ranking" value={formData.ranking} onChange={handleChange} className={input}>
                  <option value={1}>⭐ 1 - Low</option>
                  <option value={2}>⭐⭐ 2</option>
                  <option value={3}>⭐⭐⭐ 3 - Average</option>
                  <option value={4}>⭐⭐⭐⭐ 4</option>
                  <option value={5}>⭐⭐⭐⭐⭐ 5 - Excellent</option>
                </select>
              </div>
              <div>
                <label className={label}>Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className={input}>
                  <option value="open">Open for Investment</option>
                  <option value="funding">Funding in Progress</option>
                </select>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📅 Project Timeline</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className={label}>Project Start Date</label>
                <input type="date" name="projectStartDate" value={formData.projectStartDate} onChange={handleChange} className={input} />
              </div>
              <div>
                <label className={label}>Expected End Date</label>
                <input type="date" name="projectEndDate" value={formData.projectEndDate} onChange={handleChange} className={input} />
              </div>
              <div>
                <label className={label}>Expected Harvest Date</label>
                <input type="date" name="harvestDate" value={formData.harvestDate} onChange={handleChange} className={input} />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📝 Description</h2>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={input}
              placeholder="Describe the farming project, crop history, expected challenges, and what makes this a good investment opportunity..."
            />
          </div>

          {/* Verification */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">✅ Verification & Trust</h2>
            <p className="text-sm text-gray-500 mb-4">Check all that apply — investors can see this on the listing</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Document Verified', name: 'documentVerified' },
                { label: 'KYC Verified', name: 'kycVerified' },
                { label: 'Soil Test Done', name: 'soilTestReport' },
                { label: 'Land Ownership Verified', name: 'landOwnershipVerified' },
                { label: 'Govt. Approved', name: 'governmentApproved' },
                { label: 'Insurance Covered', name: 'insuranceCovered' },
                { label: 'Assured Returns', name: 'assured' },
              ].map(({ label: lbl, name }) => (
                <label key={name} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-green-50 hover:border-green-300 transition">
                  <input
                    type="checkbox"
                    name={name}
                    checked={formData[name]}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <span className="text-sm text-gray-700">{lbl}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Live Preview */}
          {formData.totalShares && formData.pricePerShare && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-green-800 mb-3">📊 Investment Preview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-500">Total Funding Goal</p>
                  <p className="font-bold text-green-700">₹{(Number(formData.totalShares) * Number(formData.pricePerShare)).toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-500">Min. Investment</p>
                  <p className="font-bold text-gray-900">₹{(Number(formData.minimumShares) * Number(formData.pricePerShare)).toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-500">Expected Return</p>
                  <p className="font-bold text-green-700">{formData.expectedReturn}%</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="font-bold text-gray-900">{formData.duration} months</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pb-8">
            <button type="submit" disabled={submitting} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 text-lg">
              {submitting ? 'Creating...' : '🌾 Create Farmer Share'}
            </button>
            <button type="button" onClick={() => router.back()} className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
