import connectDB from "../../../../libs/mongodb";
import FarmerShare from "../../../../models/farmerShare";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { farmerShareId, userId, userName, sharesOwned } = await req.json();
        
        await connectDB();
        
        const farmerShare = await FarmerShare.findById(farmerShareId);
        
        if (!farmerShare) {
            return NextResponse.json({ 
                message: "Farmer share not found" 
            }, { status: 404 });
        }
        
        // Check if enough shares are available
        if (farmerShare.availableShares < sharesOwned) {
            return NextResponse.json({ 
                message: "Not enough shares available" 
            }, { status: 400 });
        }
        
        // Check minimum shares requirement
        if (sharesOwned < farmerShare.minimumShares) {
            return NextResponse.json({ 
                message: `Minimum ${farmerShare.minimumShares} shares required` 
            }, { status: 400 });
        }
        
        const investmentAmount = sharesOwned * farmerShare.pricePerShare;
        
        // Add investor
        farmerShare.investors.push({
            userId,
            userName,
            sharesOwned,
            investmentAmount,
            investmentDate: new Date()
        });
        
        // Update available shares and total investment
        farmerShare.availableShares -= sharesOwned;
        farmerShare.totalInvestmentRaised += investmentAmount;
        
        // Update status if fully funded
        if (farmerShare.availableShares === 0) {
            farmerShare.status = "funding";
        }
        
        await farmerShare.save();
        
        return NextResponse.json({ 
            message: "Investment successful", 
            data: farmerShare 
        }, { status: 200 });
    } catch (error) {
        console.error("Error processing investment:", error);
        return NextResponse.json({ 
            message: "Error processing investment", 
            error: error.message 
        }, { status: 500 });
    }
}
