import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import Land from '@/models/land';
import User from '@/models/user';
import Transaction from '@/models/transaction';

export async function POST(request) {
  try {
    await connectMongoDB();
    const { landId, totalPayout } = await request.json();

    if (!landId || totalPayout === undefined || isNaN(totalPayout) || totalPayout < 0) {
      return NextResponse.json(
        { error: 'Invalid landId or payout amount' },
        { status: 400 }
      );
    }

    const land = await Land.findById(landId);
    if (!land) {
      return NextResponse.json(
        { error: 'Land project not found' },
        { status: 404 }
      );
    }

    // Find active investors
    const activeInvestors = land.investors.filter(inv => inv.status === 'active');
    const totalActiveShares = activeInvestors.reduce((sum, inv) => sum + (inv.sharesOwned || 0), 0);

    if (totalActiveShares === 0) {
      return NextResponse.json(
        { error: 'No active investors found for this land project.' },
        { status: 400 }
      );
    }

    // Process payouts for all active investors
    for (let inv of land.investors) {
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
          description: `Payout: Closed ${inv.sharesOwned} shares of ${land.landName} (Distributed Return)`,
          status: 'completed',
          referenceId: land._id.toString()
        });
      }
    }

    // Update land project state
    land.status = 'completed';
    land.stage = 'Completed';
    await land.save();

    return NextResponse.json({
      success: true,
      message: `Successfully distributed ₹${totalPayout} to investors.`
    });

  } catch (error) {
    console.error('Admin Land Payout Error:', error);
    return NextResponse.json(
      { error: 'Failed to distribute payout' },
      { status: 500 }
    );
  }
}
