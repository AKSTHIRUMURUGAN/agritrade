import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import FarmerShare from '@/models/farmerShare';
import Land from '@/models/land';

export async function GET() {
  try {
    await connectMongoDB();
    
    const [farmerShares, lands] = await Promise.all([
      FarmerShare.find({}),
      Land.find({})
    ]);

    const totalInvestment = farmerShares.reduce((sum, share) => 
      sum + (share.totalInvestmentRaised || 0), 0
    );
    
    const totalInvestors = new Set();
    farmerShares.forEach(share => {
      share.investors?.forEach(inv => totalInvestors.add(inv.userId));
    });

    const avgInvestment = totalInvestors.size > 0 ? totalInvestment / totalInvestors.size : 0;

    const completedProjects = farmerShares.filter(f => f.status === 'completed').length;
    const successRate = farmerShares.length > 0 ? (completedProjects / farmerShares.length) * 100 : 0;

    const cropCounts = {};
    farmerShares.forEach(share => {
      cropCounts[share.cropType] = (cropCounts[share.cropType] || 0) + 1;
    });
    const topCrops = Object.entries(cropCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const statusGroups = {};
    farmerShares.forEach(share => {
      statusGroups[share.status] = (statusGroups[share.status] || 0) + (share.totalInvestmentRaised || 0);
    });
    const investmentByStatus = Object.entries(statusGroups).map(([status, amount]) => ({
      status,
      amount,
      percentage: (amount / totalInvestment) * 100
    }));

    const monthlyGrowth = [
      { month: 'Jan', value: 45000 },
      { month: 'Feb', value: 52000 },
      { month: 'Mar', value: 61000 },
      { month: 'Apr', value: 58000 },
      { month: 'May', value: 70000 },
      { month: 'Jun', value: 85000 }
    ];

    return NextResponse.json({
      avgInvestment: Math.round(avgInvestment),
      successRate: Math.round(successRate),
      avgROI: 18,
      topCrops,
      investmentByStatus,
      monthlyGrowth
    });
  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
