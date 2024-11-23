import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getOrders, getOrderStats, updateOrderStatus } from "@/lib/db/orders";
import { sendOrderStatusEmail } from "@/lib/email";

export async function GET(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.email?.includes("kusinadeamadeo@gmail.com")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const status = searchParams.get("status") || "all";
  const search = searchParams.get("search") || "";

  try {
    const result = await getOrders({ page, limit, status, search });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.email?.includes("kusinadeamadeo@gmail.com")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { orderId, status } = await request.json();
    const updated = await updateOrderStatus(orderId, status);
    
    if (updated) {
      // Send email notification
      const order = await getOrderById(orderId);
      if (order) {
        await sendOrderStatusEmail(order);
      }
      return NextResponse.json({ success: true });
    }
    
    return new NextResponse("Order not found", { status: 404 });
  } catch (error) {
    console.error("Error updating order:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
