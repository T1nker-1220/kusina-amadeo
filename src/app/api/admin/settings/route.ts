import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Settings from "@/models/settings";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email?.includes("kusinadeamadeo@gmail.com")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    await connectToDatabase();
    const settings = await Settings.findOne() || {};
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.email?.includes("kusinadeamadeo@gmail.com")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    await connectToDatabase();
    
    // Update or create settings
    const settings = await Settings.findOne();
    if (settings) {
      Object.assign(settings, body);
      await settings.save();
    } else {
      await Settings.create(body);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving settings:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
