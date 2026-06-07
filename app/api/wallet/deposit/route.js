import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import User from '@/models/user';
import Transaction from '@/models/transaction';

export async function POST(request) {
  try {
    await connectMongoDB();
    const { userId, amount, paymentId, orderId } = await request.json();

    if (!userId || !amount || !paymentId) {
      return NextResponse.json({ error: 'Missing deposit parameters' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Add to deposits balance
    user.depositsBalance = (user.depositsBalance || 0) + Number(amount);
    await user.save();

    // Log the transaction
    const transaction = await Transaction.create({
      userId,
      type: 'deposit',
      amount: Number(amount),
      description: `Deposited ${amount} Agri Coins via Razorpay`,
      status: 'completed',
      referenceId: paymentId
    });

    return NextResponse.json({
      success: true,
      message: 'Deposit successful',
      balances: {
        deposits: user.depositsBalance,
        winnings: user.winningsBalance,
        bonus: user.bonusBalance,
        total: user.depositsBalance + user.winningsBalance + user.bonusBalance
      },
      transaction
    });
  } catch (error) {
    console.error('Deposit Error:', error);
    return NextResponse.json({ error: 'Failed to record deposit' }, { status: 500 });
  }
}
