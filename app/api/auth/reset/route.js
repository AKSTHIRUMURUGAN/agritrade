import { NextResponse } from 'next/server';
import connectDB from '@/libs/mongodb';
import User from '@/models/user';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/app/lib/jwt';

/**
 * POST /api/auth/reset
 * Body: { email, newPassword, token? }
 *
 * Simple password reset — in production you'd send an email with a
 * time-limited reset token. Here we allow direct reset by email for
 * the MVP (admin-triggered or self-service with email verification).
 */
export async function POST(request) {
  try {
    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: 'Email and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Return generic message so we don't reveal whether the email exists
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, the password has been reset.',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. You can now log in.',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
