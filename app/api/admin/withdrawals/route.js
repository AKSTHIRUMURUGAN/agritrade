import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import User from '@/models/user';
import Transaction from '@/models/transaction';
import WithdrawRequest from '@/models/withdrawRequest';

export async function GET(request) {
  try {
    await connectMongoDB();
    // Fetch all withdrawal requests, sorting by newest first
    const withdrawals = await WithdrawRequest.find().sort({ createdAt: -1 });
    return NextResponse.json({ withdrawals });
  } catch (error) {
    console.error('Admin Fetch Withdrawals Error:', error);
    return NextResponse.json({ error: 'Failed to fetch withdrawal requests' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    await connectMongoDB();
    const { requestId, action } = await request.json();

    if (!requestId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const withdrawReq = await WithdrawRequest.findById(requestId);
    if (!withdrawReq) {
      return NextResponse.json({ error: 'Withdrawal request not found' }, { status: 404 });
    }

    if (withdrawReq.status !== 'pending') {
      return NextResponse.json({ error: 'Request has already been processed' }, { status: 400 });
    }

    const user = await User.findById(withdrawReq.userId);
    
    if (action === 'approve') {
      // Approve withdrawal request
      withdrawReq.status = 'approved';
      await withdrawReq.save();

      // Update matching transaction to completed
      await Transaction.findOneAndUpdate(
        { referenceId: withdrawReq._id.toString(), type: 'withdrawal' },
        { status: 'completed', description: `Withdrawal of ${withdrawReq.amount} Agri Coins to ${withdrawReq.method} (${withdrawReq.paymentDetails}) approved` }
      );
    } else if (action === 'reject') {
      // Reject withdrawal request
      withdrawReq.status = 'rejected';
      await withdrawReq.save();

      if (user) {
        // Refund the amount back to user's winningsBalance
        user.winningsBalance = (user.winningsBalance || 0) + withdrawReq.amount;
        await user.save();
      }

      // Update matching transaction to failed/refunded
      await Transaction.findOneAndUpdate(
        { referenceId: withdrawReq._id.toString(), type: 'withdrawal' },
        { status: 'refunded', description: `Withdrawal of ${withdrawReq.amount} Agri Coins to ${withdrawReq.method} (${withdrawReq.paymentDetails}) rejected (Refunded)` }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Withdrawal request successfully ${action}d`
    });
  } catch (error) {
    console.error('Process Withdrawal Error:', error);
    return NextResponse.json({ error: 'Failed to process withdrawal' }, { status: 500 });
  }
}
