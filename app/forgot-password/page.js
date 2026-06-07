'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter new password, 3 = done
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setStep(2);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to reset password');
      } else {
        setStep(3);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">

          {/* Step 1 — Enter Email */}
          {step === 1 && (
            <>
              <div className="text-center mb-8">
                <div className="text-4xl mb-3">🔑</div>
                <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
                <p className="text-gray-500 mt-2">Enter your email to reset your password</p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Continue
                </button>
              </form>
            </>
          )}

          {/* Step 2 — New Password */}
          {step === 2 && (
            <>
              <div className="text-center mb-8">
                <div className="text-4xl mb-3">🔒</div>
                <h1 className="text-2xl font-bold text-gray-900">Set New Password</h1>
                <p className="text-gray-500 mt-2">Resetting password for <strong>{email}</strong></p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(''); }}
                  className="w-full text-gray-500 hover:text-gray-700 text-sm"
                >
                  ← Back
                </button>
              </form>
            </>
          )}

          {/* Step 3 — Success */}
          {step === 3 && (
            <div className="text-center">
              <div className="text-5xl mb-4">✅</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Reset!</h1>
              <p className="text-gray-500 mb-6">Your password has been reset successfully. You can now log in with your new password.</p>
              <Link
                href="/login"
                className="block w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition text-center"
              >
                Go to Login
              </Link>
            </div>
          )}

          {step !== 3 && (
            <p className="mt-6 text-center text-sm text-gray-500">
              Remember your password?{' '}
              <Link href="/login" className="text-green-600 hover:underline font-medium">Sign in</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
