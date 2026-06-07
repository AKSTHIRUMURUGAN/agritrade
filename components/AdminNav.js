'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminNav() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/lands', label: 'Lands', icon: '🏞️' },
    { href: '/admin/farmer-shares', label: 'Farmer Shares', icon: '🌾' },
    { href: '/admin/investors', label: 'Investors', icon: '👥' },
    { href: '/admin/verifications', label: 'Verifications', icon: '✓' },
    { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
    { href: '/admin/reports', label: 'Reports', icon: '📄' },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-2 py-4 px-3 border-b-2 text-sm font-medium whitespace-nowrap ${
                pathname === item.href
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
