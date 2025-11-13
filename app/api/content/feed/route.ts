import { NextRequest, NextResponse } from 'next/server';
import { getContentCollection } from '@/lib/mongodb';
import { requireAuth } from '@/lib/middleware';
import { UserModel } from '@/lib/models/User';

async function handleGetFeed(request: NextRequest, user: any) {
  try {
    const contentCollection = await getContentCollection();

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

    // Apply category filter
    if (category) {
      filter.category = category;
    }

    // Apply search filter
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    // Get content with pagination
    const content = await contentCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count for pagination
    const total = await contentCollection.countDocuments(filter);

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