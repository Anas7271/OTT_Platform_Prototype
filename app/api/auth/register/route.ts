import { NextRequest, NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/mongodb';
import { User, UserModel, CreateUserInput } from '@/lib/models/User';
import { generateToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const body: CreateUserInput = await request.json();
    const { username, email, password, role = 'user', subscriptionPlan = 'default' } = body;

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const usersCollection = await getUsersCollection();

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await UserModel.hashPassword(password);

    // Create new user
    const newUser: Omit<User, '_id'> = {
      username,
      email,
      password: hashedPassword,
      role,
      subscriptionPlan,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser as any);

    // Generate token
    const createdUser = {
      ...newUser,
      _id: result.insertedId,
    };

    const token = generateToken(createdUser);

    // Return user without password
    const sanitizedUser = UserModel.sanitizeUser(createdUser);

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: sanitizedUser,
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}