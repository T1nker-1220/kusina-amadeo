import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/user';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const {
      name,
      email,
      phone,
      address,
      currentPassword,
      newPassword,
    } = await request.json();

    await connectToDatabase();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if email is being changed and if it's already taken
    if (email !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already taken' },
          { status: 400 }
        );
      }
    }

    // Update basic info
    user.name = name;
    user.email = email.toLowerCase();
    user.phone = phone || user.phone;
    user.address = address || user.address;

    // Handle password change if requested
    if (currentPassword && newPassword) {
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      user.password = await bcrypt.hash(newPassword, 12);
    }

    await user.save();

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Error updating profile' },
      { status: 500 }
    );
  }
}
