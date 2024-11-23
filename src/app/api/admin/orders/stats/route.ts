import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getOrderStats } from "@/lib/db/orders";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email?.includes("kusinadeamadeo@gmail.com")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const stats = await getOrderStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching order stats:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
