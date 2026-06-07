import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import Land from '@/models/land';
import FarmerShare from '@/models/farmerShare';

export async function GET() {
  try {
    await connectMongoDB();

    const [lands, farmerShares] = await Promise.all([
      Land.find({}),
      FarmerShare.find({})
    ]);

    const totalInvestors = new Set();
    farmerShares.forEach(share => {
      share.investors?.forEach(inv => totalInvestors.add(inv.userId));
    });

    const totalInvestment = farmerShares.reduce((sum, share) => 
      sum + (share.totalInvestmentRaised || 0), 0
    );

    const stats = {
      totalLands: lands.length,
      totalFarmerShares: farmerShares.length,
      totalInvestment,
      totalInvestors: totalInvestors.size,
      activeLands: lands.filter(l => l.status === 'open').length,
      completedProjects: lands.filter(l => l.status === 'completed').length + 
                        farmerShares.filter(f => f.status === 'completed').length,
      pendingVerifications: lands.filter(l => !l.documentVerified || !l.kycVerified).length +
                           farmerShares.filter(f => !f.documentVerified || !f.kycVerified).length,
      totalRevenue: totalInvestment * 0.05
    };

    const recentActivities = [
      { icon: '🌾', title: 'New Land Added', description: 'Premium farmland in Punjab', time: '2 hours ago' },
      { icon: '💰', title: 'Investment Received', description: '₹50,000 invested in Wheat Project', time: '5 hours ago' },
      { icon: '✅', title: 'Project Completed', description: 'Rice harvest completed successfully', time: '1 day ago' }
    ];

    return NextResponse.json({ stats, recentActivities });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
