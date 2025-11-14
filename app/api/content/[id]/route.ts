import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware';
import Content from '@/lib/models/Content';
import { IContent } from '@/lib/models/Content';

async function handleGetContent(request: NextRequest, user: any) {
  try {
    // Extract ID from URL path
    const { pathname } = new URL(request.url);
    const id = pathname.split('/').pop();

    console.log('Individual content API called for:', { contentId: id, userId: user.userId });

    if (!id) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      );
    }

    // Find content by ID
    const content = await Content.findById(id).lean() as IContent | null;

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    // Check if user can access this content based on subscription
    const canAccess = (() => {
      switch (user.subscriptionPlan) {
        case 'premium':
          return true; // Can access everything
        case 'lite':
          return content.accessLevel === 'everyone' || content.accessLevel === 'lite';
        case 'default':
          return content.accessLevel === 'everyone';
        default:
          return content.accessLevel === 'everyone';
      }
    })();

    console.log('Content access check:', {
      contentId: content._id,
      contentTitle: content.title,
      contentAccessLevel: content.accessLevel,
      userSubscription: user.subscriptionPlan,
      canAccess
    });

    return NextResponse.json({
      content: {
        ...content,
        canAccess
      },
      userAccess: {
        subscriptionPlan: user.subscriptionPlan,
        canAccess
      }
    });
  } catch (error) {
    console.error('Get individual content error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handleGetContent);