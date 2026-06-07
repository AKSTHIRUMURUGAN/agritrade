'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/lands', label: 'Lands', icon: '🏞️' },
    { href: '/admin/farmer-shares', label: 'Farmer Shares', icon: '🌾' },
    { href: '/admin/investors', label: 'Investors', icon: '👥' },
    { href: '/admin/users', label: 'Users', icon: '👤' },
    { href: '/admin/verifications', label: 'Verifications', icon: '✓' },
    { href: '/admin/transactions', label: 'Transactions', icon: '💳' },
    { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
    { href: '/admin/reports', label: 'Reports', icon: '📄' },
    { href: '/admin/notifications', label: 'Notifications', icon: '🔔' },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 overflow-x-auto py-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  pathname === item.href
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
