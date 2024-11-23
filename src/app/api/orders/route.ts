import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import Order from '@/models/order';
import { sendOrderConfirmation } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to create an order' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const orderData = await req.json();
    const { items, total, paymentMethod } = orderData;

    // Basic validation
    if (!items?.length) {
      return NextResponse.json(
        { error: 'Your cart is empty' },
        { status: 400 }
      );
    }

    if (!['gcash', 'cod'].includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      );
    }

    // Create the order
    const order = await Order.create({
      userId: session.user.id,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || '',
        addons: Array.isArray(item.addons) ? item.addons : []
      })),
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'processing',
      orderStatus: 'pending'
    });

    // Send order confirmation email
    if (session.user.email) {
      try {
        await sendOrderConfirmation(order, session.user.email);
      } catch (error) {
        console.error('Error sending confirmation email:', error);
      }
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Create order error:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { error: 'Invalid order data', details: validationErrors },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: 'Failed to create order. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to view orders' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const orders = await Order.find({ userId: session.user.id })
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders. Please try again.' },
      { status: 500 }
    );
  }
}
