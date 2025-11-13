import { NextRequest, NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/mongodb';
import { requireAuth } from '@/lib/middleware';

async function handleGetMe(request: NextRequest, user: any) {
  try {
    const usersCollection = await getUsersCollection();
    const fullUser = await usersCollection.findOne({ email: user.email });

    if (!fullUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user without password
    const { password, ...sanitizedUser } = fullUser;

    return NextResponse.json({
      user: sanitizedUser,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handleGetMe);