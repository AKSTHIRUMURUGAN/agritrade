import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import FarmerShare from '@/models/farmerShare';
import Land from '@/models/land';
import User from '@/models/user';
import Transaction from '@/models/transaction';

export async function POST(request) {
  try {
    await connectMongoDB();
    
    const { projectId, userId, amount, paymentId, orderId, userName, sharesOwned } = await request.json();

    // Check if the projectId belongs to a FarmerShare or a Land
    let isLand = false;
    let target = await FarmerShare.findById(projectId);
    
    if (!target) {
      target = await Land.findById(projectId);
      if (target) {
        isLand = true;
      }
    }

    if (!target) {
      return NextResponse.json(
        { error: 'Project or Land not found' },
        { status: 404 }
      );
    }

    // Add investor data
    const investorData = {
      userId,
      userName: userName || 'Investor',
      sharesOwned: sharesOwned || 1,
      investmentAmount: amount,
      investmentDate: new Date(),
      paymentId,
      orderId,
      status: 'active'
    };

    target.investors.push(investorData);
    
    if (isLand) {
      // Deduct total stock for Land
      target.totalStock = Math.max(0, (target.totalStock || 0) - (sharesOwned || 1));
    } else {
      // Update available shares and total investment for FarmerShare
      target.availableShares -= sharesOwned || 1;
      target.totalInvestmentRaised += amount;
    }

    await target.save();

    return NextResponse.json({
      success: true,
      message: 'Investment recorded successfully',
      investment: investorData
    });
  } catch (error) {
    console.error('Investment API Error:', error);
    return NextResponse.json(
      { error: 'Failed to record investment' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectMongoDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Find all farmer shares where user has invested
    const farmerShares = await FarmerShare.find({
      'investors.userId': userId
    });

    // Find all lands where user has invested
    const lands = await Land.find({
      'investors.userId': userId
    });

    const investments = [];

    // Map farmer shares investments
    farmerShares.forEach(share => {
      const userInvestments = share.investors.filter(inv => inv.userId === userId);
      userInvestments.forEach(inv => {
        investments.push({
          ...inv.toObject(),
          projectName: share.farmerName,
          cropType: share.cropType,
          projectId: share._id,
          projectType: 'farmershare',
          currentPrice: share.pricePerShare,
          previousPrice: share.pricePerShare,
          landStatus: share.status,
          duration: share.duration || 6
        });
      });
    });

    // Map lands investments
    lands.forEach(land => {
      const userInvestments = land.investors.filter(inv => inv.userId === userId);
      userInvestments.forEach(inv => {
        investments.push({
          ...inv.toObject(),
          projectName: land.landName,
          cropType: land.seed || 'Crops',
          projectId: land._id,
          projectType: 'land',
          currentPrice: land.currentAmount || land.perStockPrice || 0,
          previousPrice: land.previousAmount || land.perStockPrice || 0,
          landStatus: land.status,
          duration: land.duration || 6
        });
      });
    });

    return NextResponse.json({ investments });
  } catch (error) {
    console.error('Get Investments Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch investments' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    await connectMongoDB();
    const { projectId, userId, investmentId, sharesToSell, sellPrice } = await request.json();

    if (!projectId || !userId || !sharesToSell || !sellPrice) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Try finding in Land or FarmerShare
    let isLand = false;
    let target = await FarmerShare.findById(projectId);
    if (!target) {
      target = await Land.findById(projectId);
      if (target) {
        isLand = true;
      }
    }

    if (!target) {
      return NextResponse.json(
        { error: 'Project or Land not found' },
        { status: 404 }
      );
    }

    // Find the investor subdocument
    let investor = null;
    if (investmentId) {
      investor = target.investors.id(investmentId);
    } else {
      investor = target.investors.find(inv => inv.userId === userId && inv.status === 'active');
    }

    if (!investor) {
      return NextResponse.json(
        { error: 'Investment record not found' },
        { status: 404 }
      );
    }

    if (investor.sharesOwned < sharesToSell) {
      return NextResponse.json(
        { error: 'Not enough shares owned' },
        { status: 400 }
      );
    }

    if (investor.sharesOwned === sharesToSell) {
      // Selling all shares in this record
      investor.status = 'withdrawn';
      investor.returnAmount = sharesToSell * sellPrice;
    } else {
      // Partial sell
      const oldShares = investor.sharesOwned;
      const oldAmount = investor.investmentAmount;
      
      const remainingShares = oldShares - sharesToSell;
      const remainingAmount = Math.round((remainingShares / oldShares) * oldAmount);
      const soldAmountProportional = oldAmount - remainingAmount;

      investor.sharesOwned = remainingShares;
      investor.investmentAmount = remainingAmount;

      target.investors.push({
        userId: investor.userId,
        userName: investor.userName,
        sharesOwned: sharesToSell,
        investmentAmount: soldAmountProportional,
        status: 'withdrawn',
        returnAmount: sharesToSell * sellPrice,
        investmentDate: investor.investmentDate,
        paymentId: investor.paymentId,
        orderId: investor.orderId
      });
    }

    if (isLand) {
      // Return shares/stocks back to available stock
      target.totalStock = (target.totalStock || 0) + sharesToSell;
    }

    await target.save();

    // Credit returns to User winningsBalance
    const totalReturns = sharesToSell * sellPrice;
    const user = await User.findById(userId);
    if (user) {
      user.winningsBalance = (user.winningsBalance || 0) + totalReturns;
      await user.save();
    }

    // Log the transaction
    await Transaction.create({
      userId,
      type: 'stock_sell',
      amount: totalReturns,
      description: `Sold ${sharesToSell} shares of ${isLand ? target.landName : target.farmerName} for ${totalReturns} Agri Coins`,
      status: 'completed',
      referenceId: investor._id ? investor._id.toString() : null
    });

    return NextResponse.json({
      success: true,
      message: 'Shares sold successfully'
    });
  } catch (error) {
    console.error('Sell Investment Error:', error);
    return NextResponse.json(
      { error: 'Failed to sell shares' },
      { status: 500 }
    );
  }
}
