import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import FarmerShare from '@/models/farmerShare';

export async function GET() {
  try {
    await connectMongoDB();
    
    const farmerShares = await FarmerShare.find({});
    
    const investorMap = new Map();
    
    farmerShares.forEach(share => {
      share.investors?.forEach(inv => {
        if (investorMap.has(inv.userId)) {
          const existing = investorMap.get(inv.userId);
          existing.totalInvestment += inv.investmentAmount;
          existing.totalReturns += inv.returnAmount || 0;
          existing.projectCount += 1;
        } else {
          investorMap.set(inv.userId, {
            userId: inv.userId,
            userName: inv.userName || 'Unknown',
            totalInvestment: inv.investmentAmount,
            totalReturns: inv.returnAmount || 0,
            projectCount: 1
          });
        }
      });
    });
    
    const investors = Array.from(investorMap.values());
    
    return NextResponse.json({ investors });
  } catch (error) {
    console.error('Investors API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch investors' },
      { status: 500 }
    );
  }
}
