'use client';

import { useState } from 'react';
import { useAuth } from '../app/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href) => pathname === href;

  const navLink = (href, label) => (
    <Link
      key={href}
      href={href}
      onClick={() => setMobileOpen(false)}
      className={`transition font-medium ${
        isActive(href)
          ? 'text-green-600 font-semibold'
          : 'text-gray-700 hover:text-green-600'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-green-600 flex items-center gap-2 flex-shrink-0">
            🌾 <span>AgriTrade</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLink('/farmershares', 'Opportunities')}
            {navLink('/land', 'Lands')}
            {navLink('/about', 'About')}

            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : user ? (
              <>
                {/* Role-aware dashboard link */}
                {user.role === 'admin'
                  ? navLink('/admin', 'Admin')
                  : navLink('/user', 'Dashboard')}
                {navLink('/user/investments', 'My Investments')}
                {navLink('/user/wallet', 'Wallet 🪙')}
                {user.role === 'admin' && navLink('/admin/withdrawals', 'Withdraw Requests')}

                <div className="flex items-center gap-3 border-l pl-4 ml-2">
                  <Link href="/user" className="flex items-center gap-2">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold text-sm">
                        {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm text-gray-700 hidden lg:block max-w-[120px] truncate">
                      {user.name || user.email}
                    </span>
                  </Link>
                  <button
                    onClick={logout}
                    className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-gray-700 hover:text-green-600 transition font-medium">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-3">
            <Link href="/farmershares" onClick={() => setMobileOpen(false)} className="block px-2 py-2 text-gray-700 hover:text-green-600">Opportunities</Link>
            <Link href="/land" onClick={() => setMobileOpen(false)} className="block px-2 py-2 text-gray-700 hover:text-green-600">Lands</Link>
            <Link href="/about" onClick={() => setMobileOpen(false)} className="block px-2 py-2 text-gray-700 hover:text-green-600">About</Link>

            {!loading && user ? (
              <>
                <Link
                  href={user.role === 'admin' ? '/admin' : '/user'}
                  onClick={() => setMobileOpen(false)}
                  className="block px-2 py-2 text-gray-700 hover:text-green-600"
                >
                  {user.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
                </Link>
                <Link href="/user/investments" onClick={() => setMobileOpen(false)} className="block px-2 py-2 text-gray-700 hover:text-green-600">
                  My Investments
                </Link>
                <Link href="/user/wallet" onClick={() => setMobileOpen(false)} className="block px-2 py-2 text-gray-700 hover:text-green-600">
                  Wallet 🪙
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin/withdrawals" onClick={() => setMobileOpen(false)} className="block px-2 py-2 text-gray-700 hover:text-green-600">
                    Withdraw Requests
                  </Link>
                )}
                <div className="px-2 py-2 flex items-center justify-between border-t border-gray-100 mt-2">
                  <span className="text-sm text-gray-600">{user.name || user.email}</span>
                  <button onClick={() => { setMobileOpen(false); logout(); }} className="text-sm text-red-600 hover:underline">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="px-2 flex gap-3 pt-2 border-t border-gray-100">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 border border-gray-300 rounded-lg text-gray-700">Login</Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 bg-green-600 text-white rounded-lg">Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
