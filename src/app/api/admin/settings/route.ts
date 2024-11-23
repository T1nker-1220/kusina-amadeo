import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Settings from "@/models/settings";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email?.includes("kusinadeamadeo@gmail.com")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDatabase();
    const settings = await Settings.findOne();
    
    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        storeName: "Kusina De Amadeo",
        storeEmail: "kusinadeamadeo@gmail.com",
        storePhone: "",
        storeAddress: "",
        orderNotifications: true,
        emailNotifications: true,
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch settings" }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email?.includes("kusinadeamadeo@gmail.com")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.storeName || !body.storeEmail) {
      return new NextResponse(
        JSON.stringify({ error: "Store name and email are required" }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await connectToDatabase();
    
    // Update or create settings
    const settings = await Settings.findOne();
    if (settings) {
      Object.assign(settings, body);
      await settings.save();
    } else {
      await Settings.create(body);
    }

    return NextResponse.json({ success: true, message: "Settings saved successfully" });
  } catch (error) {
    console.error("Error saving settings:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to save settings" }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
