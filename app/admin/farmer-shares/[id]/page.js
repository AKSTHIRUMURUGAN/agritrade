'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function FarmerShareDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [share, setShare] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchShareDetails();
    }
  }, [params.id]);

  const fetchShareDetails = async () => {
    try {
      const response = await fetch(`/api/farmershare/${params.id}`);
      const data = await response.json();
      setShare(data.farmerShare);
    } catch (error) {
      console.error('Error fetching share details:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      await fetch(`/api/farmershare/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchShareDetails();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>;
  }

  if (!share) {
    return <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Share not found</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Farmer Share Details</h1>
          <Link href="/admin/farmer-shares" className="px-4 py-2 text-gray-600 hover:text-gray-900">
            ← Back
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Farmer Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="Farmer Name" value={share.farmerName} />
                <InfoItem label="Location" value={share.farmLocation} />
                <InfoItem label="Contact" value={share.farmerContact} />
                <InfoItem label="Experience" value={`${share.farmerExperience} years`} />
                <InfoItem label="Farm Size" value={`${share.farmSize} acres`} />
                <InfoItem label="Crop Type" value={share.cropType} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Investment Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="Total Shares" value={share.totalShares} />
                <InfoItem label="Available Shares" value={share.availableShares} />
                <InfoItem label="Price per Share" value={`₹${share.pricePerShare}`} />
                <InfoItem label="Total Raised" value={`₹${share.totalInvestmentRaised?.toLocaleString()}`} />
                <InfoItem label="Target Amount" value={`₹${share.targetAmount?.toLocaleString()}`} />
                <InfoItem label="Expected Return" value={`${share.expectedReturn}%`} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Investors ({share.investors?.length || 0})</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shares</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {share.investors?.map((investor, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">{investor.userName}</td>
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
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Status</h2>
              <select
                value={share.status}
                onChange={(e) => updateStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="open">Open</option>
                <option value="funding">Funding</option>
                <option value="in-progress">In Progress</option>
                <option value="harvesting">Harvesting</option>
                <option value="completed">Completed</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Verification</h2>
              <div className="space-y-3">
                <VerificationBadge label="Document Verified" verified={share.documentVerified} />
                <VerificationBadge label="KYC Verified" verified={share.kycVerified} />
                <VerificationBadge label="Land Ownership" verified={share.landOwnershipVerified} />
                <VerificationBadge label="Soil Test" verified={share.soilTestReport} />
                <VerificationBadge label="Government Approved" verified={share.governmentApproved} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Performance</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ranking</span>
                  <span className="font-semibold">{'⭐'.repeat(share.ranking || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Previous Projects</span>
                  <span className="font-semibold">{share.previousProjectsCompleted || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-semibold">{share.successRate || 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-base font-semibold text-gray-900">{value || 'N/A'}</p>
    </div>
  );
}

function VerificationBadge({ label, verified }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      <span className={`px-2 py-1 text-xs rounded ${
        verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {verified ? '✓ Verified' : '✗ Pending'}
      </span>
    </div>
  );
}
