import { NextRequest, NextResponse } from 'next/server';
import { getContentCollection } from '@/lib/mongodb';
import { requireAuth } from '@/lib/middleware';
import { UserModel } from '@/lib/models/User';
import { ObjectId } from 'mongodb';

async function handleGetContent(request: NextRequest, user: any) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Content ID is required' },
      { status: 400 }
    );
  }
  try {
    const contentCollection = await getContentCollection();

    // Find content by ID
    const content = await contentCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    // Check if user has access to this content based on subscription
    const hasAccess = UserModel.validateSubscriptionAccess(
      user.subscriptionPlan,
      content.accessLevel
    );

    if (!hasAccess) {
      return NextResponse.json(
        {
          error: 'Access denied. This content requires a higher subscription plan.',
          requiredPlan: content.accessLevel,
          currentPlan: user.subscriptionPlan
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      content,
    });
  } catch (error) {
    console.error('Get content detail error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handleGetContent);