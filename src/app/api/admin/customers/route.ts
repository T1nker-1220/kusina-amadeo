import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/user";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email?.includes("kusinadeamadeo@gmail.com")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    await connectToDatabase();
    
    // Get all customers (excluding admin users)
    const customers = await User.find({
      email: { $ne: "kusinadeamadeo@gmail.com" }
    }).select("name email createdAt").sort({ createdAt: -1 });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
