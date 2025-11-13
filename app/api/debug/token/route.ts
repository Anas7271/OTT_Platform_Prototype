import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromHeaders(request.headers);

    if (!token) {
      return NextResponse.json({
        error: 'No token found',
        headers: Object.fromEntries(request.headers.entries())
      }, { status: 401 });
    }

    console.log('Token received:', token.substring(0, 20) + '...');
    console.log('JWT_SECRET from env:', process.env.JWT_SECRET ? 'Exists' : 'Missing');

    const decoded = verifyToken(token);

    return NextResponse.json({
      success: true,
      decoded: {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        subscriptionPlan: decoded.subscriptionPlan
      }
    });
  } catch (error: any) {
    console.error('Token verification error:', error);
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 401 });
  }
}