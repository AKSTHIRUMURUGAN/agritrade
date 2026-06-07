import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import FarmerShare from '@/models/farmerShare';

export async function GET(request, { params }) {
  try {
    await connectMongoDB();
    const farmerShare = await FarmerShare.findById(params.id);
    
    if (!farmerShare) {
      return NextResponse.json(
        { error: 'Farmer share not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ farmerShare });
  } catch (error) {
    console.error('Error fetching farmer share:', error);
    return NextResponse.json(
      { error: 'Failed to fetch farmer share' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectMongoDB();
    const body = await request.json();
    
    const farmerShare = await FarmerShare.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );
    
    if (!farmerShare) {
      return NextResponse.json(
        { error: 'Farmer share not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ farmerShare });
  } catch (error) {
    console.error('Error updating farmer share:', error);
    return NextResponse.json(
      { error: 'Failed to update farmer share' },
      { status: 500 }
    );
  }
}
