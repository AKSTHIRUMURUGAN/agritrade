import connectDB from "../../../../libs/mongodb";
import Land from "../../../../models/land";
import { NextResponse } from "next/server";

export async function PUT(req,{params}){
    const {id}=params;
    const {landImage,landName,landPlace,landDescription,totalStock,minimumStock,perStockPrice,minimumStockPrice,seed,duration,profitLossMargin,soilTest,documentVerified,kycVerified,ranking,profitLossPercentage,yearsStayInMarket,assured,status,previousAmount,currentAmount,previousAmounts}=await req.json();
    await connectDB();
    await Land.findByIdAndUpdate(id,{landImage,landName,landPlace,landDescription,totalStock,minimumStock,perStockPrice,minimumStockPrice,seed,duration,profitLossMargin,soilTest,documentVerified,kycVerified,ranking,profitLossPercentage,yearsStayInMarket,assured,status,previousAmount,currentAmount,previousAmounts})
    return NextResponse.json({message:"updated successfully"},{status:200})
}
export async function GET(req,{params}){
    const {id}=params;
    await connectDB();
    const land=await Land.findOne({_id:id})
    return NextResponse.json({land},{status:200})
}