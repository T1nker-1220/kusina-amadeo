import Order, { IOrder } from '@/models/order';
import { connectToDatabase } from '@/lib/db';

interface OrderStats {
  total: number;
  pending: number;
  completed: number;
  cancelled: number;
  totalAmount: number;
}

interface GetOrdersOptions {
  page?: number;
  perPage?: number;
  status?: string;
  userId?: string;
}

export async function getOrderById(id: string): Promise<IOrder | null> {
  try {
    await connectToDatabase();
    const order = await Order.findById(id);
    return order;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}

export async function getOrders(options: GetOrdersOptions = {}): Promise<{ orders: IOrder[]; total: number }> {
  try {
    await connectToDatabase();
    const {
      page = 1,
      perPage = 10,
      status,
      userId
    } = options;

    // Build query
    const query: any = {};
    if (status) query.orderStatus = status;
    if (userId) query.userId = userId;

    // Get total count
    const total = await Order.countDocuments(query);

    // Get paginated orders
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    return { orders, total };
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

export async function getOrdersByUserId(userId: string): Promise<IOrder[]> {
  try {
    const { orders } = await getOrders({ userId });
    return orders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: IOrder['orderStatus']
): Promise<IOrder | null> {
  try {
    await connectToDatabase();
    const order = await Order.findByIdAndUpdate(
      orderId,
      { 
        $set: { 
          orderStatus: status,
          updatedAt: new Date()
        } 
      },
      { new: true }
    );
    return order;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

export async function getOrderStats(): Promise<OrderStats> {
  try {
    await connectToDatabase();
    
    const [
      total,
      pending,
      completed,
      cancelled,
      { totalAmount = 0 } = {}
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: 'pending' }),
      Order.countDocuments({ orderStatus: 'completed' }),
      Order.countDocuments({ orderStatus: 'cancelled' }),
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$total' }
          }
        }
      ]).then(results => results[0] || { totalAmount: 0 })
    ]);

    return {
      total,
      pending,
      completed,
      cancelled,
      totalAmount
    };
  } catch (error) {
    console.error('Error getting order stats:', error);
    throw error;
  }
}
