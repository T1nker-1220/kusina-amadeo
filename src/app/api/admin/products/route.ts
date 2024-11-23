import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email?.includes("kusinadeamadeo@gmail.com")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    await connectToDatabase();
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.email?.includes("kusinadeamadeo@gmail.com")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    await connectToDatabase();
    
    const product = await Product.create(body);
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
