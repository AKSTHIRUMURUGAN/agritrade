import connectDB from "../../../libs/mongodb";
import FarmerShare from "../../../models/farmerShare";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const data = await req.json();
        
        await connectDB();
        
        // Create a new FarmerShare document
        const farmerShare = await FarmerShare.create(data);
        
        return NextResponse.json({ 
            message: "Farmer share created successfully", 
            data: farmerShare 
        }, { status: 201 });
    } catch (error) {
        console.error("Error creating farmer share:", error);
        return NextResponse.json({ 
            message: "Error creating farmer share", 
            error: error.message 
        }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const cropType = searchParams.get("cropType");
        
        let query = {};
        if (status) query.status = status;
        if (cropType) query.cropType = cropType;
        
        const farmerShares = await FarmerShare.find(query).sort({ createdAt: -1 });
        
        return NextResponse.json({ farmerShares });
    } catch (error) {
        console.error("Error fetching farmer shares:", error);
        return NextResponse.json({ 
            message: "Error fetching farmer shares", 
            error: error.message 
        }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const id = req.nextUrl.searchParams.get("id");
        if (!id) {
            return NextResponse.json({ message: "ID is required" }, { status: 400 });
        }
        await connectDB();
        await FarmerShare.findByIdAndDelete(id);
        return NextResponse.json({ message: "Farmer share deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting farmer share:", error);
        return NextResponse.json({ 
            message: "Error deleting farmer share", 
            error: error.message 
        }, { status: 500 });
    }
}
