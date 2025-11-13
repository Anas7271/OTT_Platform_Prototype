import { NextRequest, NextResponse } from 'next/server';
import { getContentCollection } from '@/lib/mongodb';
import { requireAuth } from '@/lib/middleware';
import { UserModel } from '@/lib/models/User';

async function handleSearch(request: NextRequest, user: any) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.trim() === '') {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const contentCollection = await getContentCollection();
    const skip = (page - 1) * limit;

    // Build filter based on user subscription and search query
    const filter: any = {
      title: { $regex: query, $options: 'i' }
    };

    // Apply subscription-based filtering
    if (user.subscriptionPlan === 'default') {
      filter.accessLevel = 'everyone';
    } else if (user.subscriptionPlan === 'lite') {
      filter.accessLevel = { $in: ['everyone', 'lite'] };
    }
    // Premium users can see all content

    // Get search results with pagination
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
      query,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      userSubscription: user.subscriptionPlan,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handleSearch);