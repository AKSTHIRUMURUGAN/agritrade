import { NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/jwt';

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Optionally fetch fresh user data from database
    // const user = await User.findById(decoded.userId);

    return NextResponse.json({
      success: true,
      user: {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
