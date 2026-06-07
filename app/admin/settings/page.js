'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    platformFee: 5,
    investorShare: 60,
    farmerShare: 40,
    minInvestment: 1000,
    maxInvestment: 1000000,
    emailNotifications: true,
    smsNotifications: false,
    autoApproval: false
  });

  const handleSave = async () => {
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
          <Link href="/admin" className="px-4 py-2 text-gray-600 hover:text-gray-900">
            ← Back
          </Link>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Financial Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform Fee (%)
                </label>
                <input
                  type="number"
                  value={settings.platformFee}
                  onChange={(e) => setSettings({...settings, platformFee: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investor Share (%)
                  </label>
                  <input
                    type="number"
                    value={settings.investorShare}
                    onChange={(e) => setSettings({...settings, investorShare: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Farmer Share (%)
                  </label>
                  <input
                    type="number"
                    value={settings.farmerShare}
                    onChange={(e) => setSettings({...settings, farmerShare: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Investment (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.minInvestment}
                    onChange={(e) => setSettings({...settings, minInvestment: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Investment (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.maxInvestment}
                    onChange={(e) => setSettings({...settings, maxInvestment: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Notification Settings</h2>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-gray-700">Email Notifications</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={(e) => setSettings({...settings, smsNotifications: e.target.checked})}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-gray-700">SMS Notifications</span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Approval Settings</h2>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.autoApproval}
                onChange={(e) => setSettings({...settings, autoApproval: e.target.checked})}
                className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
              />
              <span className="text-gray-700">Auto-approve verified projects</span>
            </label>
          </div>

          <button
            onClick={handleSave}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
