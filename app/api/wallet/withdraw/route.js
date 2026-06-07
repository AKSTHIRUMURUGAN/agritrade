import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import User from '@/models/user';
import Transaction from '@/models/transaction';
import WithdrawRequest from '@/models/withdrawRequest';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export async function POST(request) {
  try {
    await connectMongoDB();
    const { userId, amount, method, paymentDetails } = await request.json();

    if (!userId || !amount || !method || !paymentDetails) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const withdrawAmount = Number(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      return NextResponse.json({ error: 'Invalid withdrawal amount' }, { status: 400 });
    }

    // 1. UPI Verification via Razorpay (or regex fallback if test credentials)
    if (method === 'UPI') {
      let upiValid = false;
      let upiCustomerName = 'Verified User';
      try {
        // Use SDK to validate VPA (UPI ID)
        const vpaRes = await razorpay.payments.validateVPA({ vpa: paymentDetails });
        upiValid = vpaRes.success;
        upiCustomerName = vpaRes.customer_name || 'Verified User';
      } catch (err) {
        console.warn('Razorpay VPA validation failed/unsupported in test mode, using validation fallback:', err.message);
        // Fallback: Validate with standard UPI regex format
        const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
        upiValid = upiRegex.test(paymentDetails);
      }

      if (!upiValid) {
        return NextResponse.json({ error: 'Invalid UPI ID format or verification failed' }, { status: 400 });
      }
    }

    // 2. Fetch User & Verify Balance
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if ((user.winningsBalance || 0) < withdrawAmount) {
      return NextResponse.json({ error: 'Insufficient winnings balance' }, { status: 400 });
    }

    // 3. Deduct from winningsBalance immediately (put on hold)
    user.winningsBalance -= withdrawAmount;
    await user.save();

    // 4. Create Withdrawal Request
    const withdrawRequest = await WithdrawRequest.create({
      userId,
      userName: user.name || 'User',
      userEmail: user.email,
      amount: withdrawAmount,
      method,
      paymentDetails,
      status: 'pending'
    });

    // 5. Log Transaction (marked pending)
    await Transaction.create({
      userId,
      type: 'withdrawal',
      amount: withdrawAmount,
      description: `Requested withdrawal of ${withdrawAmount} Agri Coins to ${method} (${paymentDetails})`,
      status: 'pending',
      referenceId: withdrawRequest._id.toString()
    });

    return NextResponse.json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      balances: {
        deposits: user.depositsBalance,
        winnings: user.winningsBalance,
        bonus: user.bonusBalance,
        total: user.depositsBalance + user.winningsBalance + user.bonusBalance
      }
    });
  } catch (error) {
    console.error('Withdrawal Request Error:', error);
    return NextResponse.json({ error: 'Failed to process withdrawal request' }, { status: 500 });
  }
}
