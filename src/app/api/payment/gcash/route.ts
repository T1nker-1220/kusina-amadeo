import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import Order from '@/models/order';

// GCash Express Payment Details
const GCASH_NUMBER = '09605088715'; // Replace with your GCash number
const GCASH_NAME = 'John Nathaniel Marquez'; // Account name

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to process payment' },
        { status: 401 }
      );
    }

    const { orderId, amount } = await req.json();

    await connectToDatabase();

    // Get the order
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify that the order belongs to the user
    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized access to order' },
        { status: 403 }
      );
    }

    // Update order with payment details
    order.paymentStatus = 'processing';
    order.paymentDetails = {
      provider: 'gcash',
      accountNumber: GCASH_NUMBER,
      accountName: GCASH_NAME,
      amount: amount.toFixed(2),
      timestamp: new Date()
    };
    await order.save();

    // Return GCash payment details
    return NextResponse.json({
      success: true,
      paymentDetails: {
        accountNumber: GCASH_NUMBER,
        accountName: GCASH_NAME,
        amount: amount.toFixed(2),
        reference: `ORDER-${orderId}`
      }
    });
  } catch (error) {
    console.error('GCash payment error:', error);
    return NextResponse.json(
      { error: 'Failed to process GCash payment. Please try again.' },
      { status: 500 }
    );
  }
}
