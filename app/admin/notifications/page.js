'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminNotificationsPage() {
  const [notification, setNotification] = useState({
    title: '',
    message: '',
    type: 'all',
    priority: 'normal'
  });

  const sendNotification = async () => {
    if (!notification.title || !notification.message) {
      alert('Please fill in all fields');
      return;
    }
    
    alert('Notification sent successfully!');
    setNotification({ title: '', message: '', type: 'all', priority: 'normal' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Send Notifications</h1>
          <Link href="/admin" className="px-4 py-2 text-gray-600 hover:text-gray-900">
            ← Back
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notification Title
              </label>
              <input
                type="text"
                value={notification.title}
                onChange={(e) => setNotification({...notification, title: e.target.value})}
                placeholder="Enter notification title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={notification.message}
                onChange={(e) => setNotification({...notification, message: e.target.value})}
                placeholder="Enter notification message"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Send To
                </label>
                <select
                  value={notification.type}
                  onChange={(e) => setNotification({...notification, type: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Users</option>
                  <option value="investors">Investors Only</option>
                  <option value="farmers">Farmers Only</option>
                  <option value="admins">Admins Only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={notification.priority}
                  onChange={(e) => setNotification({...notification, priority: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <button
              onClick={sendNotification}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
            >
              Send Notification
            </button>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Notifications</h2>
          <div className="space-y-3">
            <NotificationItem
              title="New Investment Opportunity"
              message="Premium wheat farming project now available"
              time="2 hours ago"
              type="all"
            />
            <NotificationItem
              title="Project Completed"
              message="Rice harvest project successfully completed"
              time="1 day ago"
              type="investors"
            />
            <NotificationItem
              title="Verification Required"
              message="5 new projects pending verification"
              time="2 days ago"
              type="admins"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationItem({ title, message, time, type }) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">{type}</span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{message}</p>
      <p className="text-xs text-gray-400">{time}</p>
    </div>
  );
}
