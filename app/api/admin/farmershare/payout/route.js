import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import FarmerShare from '@/models/farmerShare';
import User from '@/models/user';
import Transaction from '@/models/transaction';

export async function POST(request) {
  try {
    await connectMongoDB();
    const { farmerShareId, totalPayout } = await request.json();

    if (!farmerShareId || totalPayout === undefined || isNaN(totalPayout) || totalPayout < 0) {
      return NextResponse.json(
        { error: 'Invalid farmerShareId or payout amount' },
        { status: 400 }
      );
    }

    const farmerShare = await FarmerShare.findById(farmerShareId);
    if (!farmerShare) {
      return NextResponse.json(
        { error: 'Farmer share project not found' },
        { status: 404 }
      );
    }

    // Find active investors
    const activeInvestors = farmerShare.investors.filter(inv => inv.status === 'active');
    const totalActiveShares = activeInvestors.reduce((sum, inv) => sum + (inv.sharesOwned || 0), 0);

    if (totalActiveShares === 0) {
      return NextResponse.json(
        { error: 'No active investors found for this farmer share project.' },
        { status: 400 }
      );
    }

    // Process payouts for all active investors
    for (let inv of farmerShare.investors) {
      if (inv.status === 'active') {
        const shareRatio = inv.sharesOwned / totalActiveShares;
        const investorPayout = Math.round(totalPayout * shareRatio * 100) / 100; // round to 2 decimals

        // Update investor record
        inv.status = 'withdrawn'; // Mark as withdrawn/completed so they can no longer sell or get paid again
        inv.returnAmount = investorPayout;

        // Credit to investor wallet winningsBalance
        const user = await User.findById(inv.userId);
        if (user) {
          user.winningsBalance = (user.winningsBalance || 0) + investorPayout;
          await user.save();
        }

        // Create transaction history log
        await Transaction.create({
          userId: inv.userId,
          type: 'stock_sell',
          amount: investorPayout,
          description: `Payout: Closed ${inv.sharesOwned} shares of ${farmerShare.farmerName}'s farm (Distributed Return)`,
          status: 'completed',
          referenceId: farmerShare._id.toString()
        });
      }
    }

    // Update farmer share project state
    farmerShare.status = 'completed';
    farmerShare.stage = 'Completed';
    await farmerShare.save();

    return NextResponse.json({
      success: true,
      message: `Successfully distributed ₹${totalPayout} to investors.`
    });

  } catch (error) {
    console.error('Admin FarmerShare Payout Error:', error);
    return NextResponse.json(
      { error: 'Failed to distribute payout' },
      { status: 500 }
    );
  }
}
