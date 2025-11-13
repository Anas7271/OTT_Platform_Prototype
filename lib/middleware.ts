import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromHeaders, verifyToken } from './auth';
import { getUsersCollection } from './mongodb';
import { ObjectId } from 'mongodb';

export async function authenticate(request: NextRequest) {
  try {
    const token = getTokenFromHeaders(request.headers as any);
    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);

    // Get fresh user data from database
    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });

    if (!user) {
      return null;
    }

    return {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      subscriptionPlan: user.subscriptionPlan,
      username: user.username,
    };
  } catch (error) {
    return null;
  }
}

export function requireAuth(handler: (req: NextRequest, user: any) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const user = await authenticate(req);

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    return handler(req, user);
  };
}

export function requireRole(requiredRole: string) {
  return function(handler: (req: NextRequest, user: any) => Promise<NextResponse>) {
    return async (req: NextRequest) => {
      const user = await authenticate(req);

      if (!user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      if (user.role !== requiredRole) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      return handler(req, user);
    };
  };
}