import { NextResponse } from 'next/server';
import connectDB from '@/libs/mongodb';
import FarmerShare from '@/models/farmerShare';

export async function GET() {
  try {
    await connectDB();

    const farmerShares = await FarmerShare.find({}).select('farmerName cropType investors createdAt');

    const transactions = [];

    farmerShares.forEach((share) => {
      share.investors?.forEach((inv) => {
        transactions.push({
          id: inv._id?.toString(),
          type: 'investment',
          investor: inv.userName || 'Unknown',
          userId: inv.userId,
          project: `${share.farmerName} — ${share.cropType}`,
          projectId: share._id.toString(),
          amount: inv.investmentAmount,
          sharesOwned: inv.sharesOwned,
          date: inv.investmentDate,
          status: inv.status || 'active',
          returnAmount: inv.returnAmount || 0,
        });
      });
    });

    // Sort by most recent first
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalVolume = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalTransactions = transactions.length;
    const completedCount = transactions.filter((t) => t.status === 'completed').length;

    return NextResponse.json({
      transactions,
      summary: { totalVolume, totalTransactions, completedCount },
    });
  } catch (error) {
    console.error('Transactions API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
