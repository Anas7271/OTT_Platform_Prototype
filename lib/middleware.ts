import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromHeaders, verifyToken } from './auth';
import { getUsersCollection } from './mongodb';
import { ObjectId } from 'mongodb';

export async function authenticate(request: NextRequest) {
  try {
    const token = getTokenFromHeaders(request.headers as any);
    if (!token) {
      console.log('Middleware: No token provided');
      return null;
    }

    const decoded = verifyToken(token);
    console.log('Middleware: Token decoded, userId:', decoded.userId);

    // Get fresh user data from database
    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });

    if (!user) {
      console.log('Middleware: User not found in database for userId:', decoded.userId);
      return null;
    }

    console.log('Middleware: User authenticated:', { userId: user._id, role: user.role, username: user.username });

    return {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      subscriptionPlan: user.subscriptionPlan,
      username: user.username,
    };
  } catch (error) {
    console.error('Middleware: Authentication error:', error);
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