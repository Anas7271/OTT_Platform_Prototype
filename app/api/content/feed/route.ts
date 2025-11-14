import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware';
import { UserModel } from '@/lib/models/User';
import Content from '@/lib/models/Content';

async function handleGetFeed(request: NextRequest, user: any) {
  try {
    console.log('Feed API called for user:', { subscriptionPlan: user.subscriptionPlan, userId: user.userId });

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build filter based on user subscription and search criteria
    const filter: any = {};

    // Apply subscription-based filtering
    if (user.subscriptionPlan === 'default') {
      filter.accessLevel = 'everyone';
    } else if (user.subscriptionPlan === 'lite') {
      filter.accessLevel = { $in: ['everyone', 'lite'] };
    }
    // Premium users can see all content

    console.log('Feed API filter:', filter);

    // Apply category filter
    if (category) {
      filter.category = category;
    }

    // Apply search filter
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    // First, let's get total count of all documents using Mongoose
    const totalAll = await Content.countDocuments({});
    console.log('Total documents using Mongoose:', totalAll);

    // Get content with pagination using Mongoose
    const content = await Content.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // Convert to plain JavaScript objects

    // Get total count for pagination
    const total = await Content.countDocuments(filter);

    console.log('Feed API result:', { contentCount: content.length, total, filter });

    // Debug: Show first few documents structure
    if (content.length > 0) {
      console.log('Sample document structure:', JSON.stringify(content[0], null, 2));
    }

    return NextResponse.json({
      content,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      filters: {
        category,
        search,
        userSubscription: user.subscriptionPlan,
      },
      debug: {
        totalAll,
        contentCount: content.length,
        filter,
      },
    });
  } catch (error) {
    console.error('Get feed error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handleGetFeed);