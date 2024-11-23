import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/user";
import Order from "@/models/order";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session?.user?.email?.includes("kusinadeamadeo@gmail.com")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    await connectToDatabase();
    
    // Get customer details
    const customer = await User.findById(params.id).select("name email createdAt");
    if (!customer) {
      return new NextResponse("Customer not found", { status: 404 });
    }

    // Get customer's orders
    const orders = await Order.find({ userId: params.id })
      .sort({ createdAt: -1 })
      .select("total status createdAt items");

    // Combine customer details with their orders
    const customerWithOrders = {
      ...customer.toJSON(),
      orders,
    };

    return NextResponse.json(customerWithOrders);
  } catch (error) {
    console.error("Error fetching customer details:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
