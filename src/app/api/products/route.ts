import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Product from '@/models/Product';

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const availability = searchParams.get('availability');

    // Build query
    let query: any = {};
    
    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Availability filter
    if (availability === 'available') {
      query.isAvailable = true;
    } else if (availability === 'unavailable') {
      query.isAvailable = false;
    }

    const products = await Product.find(query).sort({ category: 1, name: 1 });
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
