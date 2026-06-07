import { NextResponse } from 'next/server';
import connectDB from '@/libs/mongodb';
import User from '@/models/user';

export async function GET() {
  try {
    await connectDB();

    const users = await User.find({}).select('-password').sort({ createdAt: -1 });

    const formatted = users.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.isActive ? 'active' : 'suspended',
      isVerified: u.isVerified,
      lastLogin: u.lastLogin,
      createdAt: u.createdAt,
    }));

    return NextResponse.json({ users: formatted });
  } catch (error) {
    console.error('Users API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();

    const { userId, action } = await request.json();

    if (!userId || !action) {
      return NextResponse.json({ error: 'userId and action are required' }, { status: 400 });
    }

    const update = action === 'suspend' ? { isActive: false } : { isActive: true };
    const user = await User.findByIdAndUpdate(userId, update, { new: true }).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `User ${action}d successfully`,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.isActive ? 'active' : 'suspended',
      },
    });
  } catch (error) {
    console.error('Update User Error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
