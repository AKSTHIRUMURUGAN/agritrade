import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import Land from '@/models/land';
import FarmerShare from '@/models/farmerShare';

export async function GET() {
  try {
    await connectMongoDB();
    
    const [lands, farmerShares] = await Promise.all([
      Land.find({
        $or: [
          { documentVerified: false },
          { kycVerified: false },
          { soilTest: false }
        ]
      }),
      FarmerShare.find({
        $or: [
          { documentVerified: false },
          { kycVerified: false },
          { soilTestReport: false }
        ]
      })
    ]);

    const pendingItems = [
      ...lands.map(land => ({
        _id: land._id,
        type: 'land',
        name: land.landName,
        location: land.landPlace,
        image: land.landImage,
        documentVerified: land.documentVerified,
        kycVerified: land.kycVerified,
        soilTest: land.soilTest
      })),
      ...farmerShares.map(share => ({
        _id: share._id,
        type: 'farmerShare',
        name: share.farmerName,
        location: share.farmLocation,
        image: share.farmerImage,
        documentVerified: share.documentVerified,
        kycVerified: share.kycVerified,
        soilTest: share.soilTestReport
      }))
    ];

    return NextResponse.json({ pendingItems });
  } catch (error) {
    console.error('Verifications API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verifications' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectMongoDB();
    
    const { id, type, field, value } = await request.json();
    
    const Model = type === 'land' ? Land : FarmerShare;
    const updateField = field === 'soilTest' && type === 'farmerShare' ? 'soilTestReport' : field;
    
    await Model.findByIdAndUpdate(id, { [updateField]: value });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update Verification Error:', error);
    return NextResponse.json(
      { error: 'Failed to update verification' },
      { status: 500 }
    );
  }
}
