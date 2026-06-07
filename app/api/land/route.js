import connectDB from "../../../libs/mongodb";
import Land from "../../../models/land";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const {
            landImage, landName, landPlace, landDescription, totalStock,
            minimumStock, perStockPrice, minimumStockPrice, seed, duration,
            profitLossMargin, soilTest, documentVerified, kycVerified, ranking,
            profitLossPercentage, yearsStayInMarket, assured, status,
            currentAmount
        } = await req.json();
        
        await connectDB();
        let previousAmounts=[currentAmount]
        
        // Create a new Land document
        await Land.create({
            landImage, landName, landPlace, landDescription, totalStock,
            minimumStock, perStockPrice, minimumStockPrice, seed, duration,
            profitLossMargin, soilTest, documentVerified, kycVerified, ranking,
            profitLossPercentage, yearsStayInMarket, assured, status,
            currentAmount,previousAmounts
        });
        
        // Return success response
        return NextResponse.json({ message: "Land created" }, { status: 201 });
    } catch (error) {
        console.error("Error creating land:", error);
        // Return error response
        return NextResponse.json({ message: "Error creating land", error }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();
        // Fetch all Land documents
        const lands = await Land.find();
        // Return success response with fetched documents
        return NextResponse.json({ lands });
    } catch (error) {
        console.error("Error fetching lands:", error);
        // Return error response
        return NextResponse.json({ message: "Error fetching lands", error }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        // Extract id from query parameters
        const id = req.nextUrl.searchParams.get("id");
        await connectDB();
        // Find and delete the Land document by id
        await Land.findByIdAndDelete(id);
        // Return success response
        return NextResponse.json({ message: "Successfully deleted" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting land:", error);
        // Return error response
        return NextResponse.json({ message: "Error deleting land", error }, { status: 500 });
    }
}
