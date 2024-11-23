import { Order } from "@/models/Order";
import { connectToDatabase } from "@/lib/db";

export async function getOrders(options: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  const { page = 1, limit = 10, status, search } = options;
  const skip = (page - 1) * limit;

  const query: any = {};
  if (status && status !== "all") {
    query.status = status;
  }
  if (search) {
    query.$or = [
      { "customer.name": { $regex: search, $options: "i" } },
      { "customer.email": { $regex: search, $options: "i" } },
      { _id: { $regex: search, $options: "i" } },
    ];
  }

  const db = await connectToDatabase();
  const orders = await db
    .collection("orders")
    .find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  const total = await db.collection("orders").countDocuments(query);

  return {
    orders,
    total,
    pages: Math.ceil(total / limit),
  };
}

export async function getOrderStats() {
  const db = await connectToDatabase();
  const stats = await db
    .collection("orders")
    .aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          total: { $sum: "$total" },
        },
      },
    ])
    .toArray();

  const result = {
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
    totalAmount: 0,
  };

  stats.forEach((stat) => {
    if (stat._id) {
      result[stat._id] = stat.count;
      result.totalAmount += stat.total;
    }
    result.total += stat.count;
  });

  return result;
}

export async function updateOrderStatus(orderId: string, status: string) {
  const db = await connectToDatabase();
  const result = await db
    .collection("orders")
    .updateOne(
      { _id: orderId },
      { $set: { status, updatedAt: new Date() } }
    );

  return result.modifiedCount > 0;
}

export async function getOrderById(orderId: string) {
  const db = await connectToDatabase();
  const order = await db.collection("orders").findOne({ _id: orderId });
  return order;
}
