'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminVerificationsPage() {
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  const fetchPendingVerifications = async () => {
    try {
      const response = await fetch('/api/admin/verifications');
      const data = await response.json();
      setPendingItems(data.pendingItems || []);
    } catch (error) {
      console.error('Error fetching verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateVerification = async (id, type, field, value) => {
    try {
      await fetch('/api/admin/verifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type, field, value })
      });
      fetchPendingVerifications();
    } catch (error) {
      console.error('Error updating verification:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Pending Verifications</h1>
          <Link href="/admin" className="px-4 py-2 text-gray-600 hover:text-gray-900">
            ← Back
          </Link>
        </div>

        <div className="space-y-4">
          {pendingItems.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="h-16 w-16 rounded object-cover" />
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.location}</p>
                      <span className="inline-block mt-1 px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">
                        {item.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <VerificationCheckbox
                      label="Document Verified"
                      checked={item.documentVerified}
                      onChange={(value) => updateVerification(item._id, item.type, 'documentVerified', value)}
                    />
                    <VerificationCheckbox
                      label="KYC Verified"
                      checked={item.kycVerified}
                      onChange={(value) => updateVerification(item._id, item.type, 'kycVerified', value)}
                    />
                    <VerificationCheckbox
                      label="Soil Test"
                      checked={item.soilTest}
                      onChange={(value) => updateVerification(item._id, item.type, 'soilTest', value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {pendingItems.length === 0 && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 text-lg">No pending verifications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VerificationCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}
