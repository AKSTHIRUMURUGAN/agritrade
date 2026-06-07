import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import User from '@/models/user';
import Transaction from '@/models/transaction';
import WithdrawRequest from '@/models/withdrawRequest';

export async function GET(request) {
  try {
    await connectMongoDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Self-healing: if user has a bonus balance but no transaction log for it, create it
    const bonusTx = await Transaction.findOne({ userId, type: 'bonus' });
    if (!bonusTx && (user.bonusBalance > 0)) {
      await Transaction.create({
        userId,
        type: 'bonus',
        amount: user.bonusBalance,
        description: 'Sign-up registration bonus',
        status: 'completed'
      });
    }

    // Fetch all transactions and withdrawals for this user
    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
    const withdrawals = await WithdrawRequest.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({
      balances: {
        deposits: user.depositsBalance || 0,
        winnings: user.winningsBalance || 0,
        bonus: user.bonusBalance || 0,
        total: (user.depositsBalance || 0) + (user.winningsBalance || 0) + (user.bonusBalance || 0)
      },
      transactions,
      withdrawals
    });
  } catch (error) {
    console.error('Wallet Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch wallet info' }, { status: 500 });
  }
}
