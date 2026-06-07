import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import User from '@/models/user';
import { generateToken } from '@/app/lib/jwt';

export async function POST(request) {
  try {
    const { email, name, photoURL, uid } = await request.json();

    if (!email || !uid) {
      return NextResponse.json(
        { error: 'Email and UID are required' },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists, update last login
      user.lastLogin = new Date();
      if (photoURL && !user.avatar) {
        user.avatar = photoURL;
      }
      await user.save();
    } else {
      // Create new user with Google OAuth
      user = await User.create({
        email,
        name: name || email.split('@')[0],
        password: uid, // Use Firebase UID as password (won't be used for login)
        role: 'user',
        avatar: photoURL,
        isVerified: true, // Google accounts are pre-verified
        isActive: true
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    // Prepare user data (without password)
    const userData = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar
    };

    return NextResponse.json({
      success: true,
      token,
      user: userData
    });

  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
