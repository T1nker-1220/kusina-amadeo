import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getOrders, getOrderStats, updateOrderStatus, getOrderById } from "@/lib/db/orders";
import { sendOrderStatusEmail } from "@/lib/email";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email?.includes("kusinadeamadeo@gmail.com")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get URL parameters
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const status = url.searchParams.get("status") || "all";
    const perPage = 10; // Items per page

    try {
      const { orders, total } = await getOrders({
        page,
        perPage,
        status: status === "all" ? undefined : status,
      });

      return NextResponse.json({
        orders,
        total,
        perPage,
        currentPage: page,
        totalPages: Math.ceil(total / perPage)
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in GET /api/admin/orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email?.includes("kusinadeamadeo@gmail.com")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, status } = await request.json();
    
    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ["pending", "confirmed", "preparing", "ready", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid order status" },
        { status: 400 }
      );
    }

    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const updated = await updateOrderStatus(orderId, status);
    if (!updated) {
      return NextResponse.json(
        { error: "Failed to update order status" },
        { status: 500 }
      );
    }

    // Send email notification
    try {
      await sendOrderStatusEmail(updated);
    } catch (error) {
      console.error("Failed to send status email:", error);
      // Continue even if email fails
    }

    return NextResponse.json({
      success: true,
      order: updated
    });
  } catch (error) {
    console.error("Error in PATCH /api/admin/orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
