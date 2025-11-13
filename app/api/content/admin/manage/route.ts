import { NextRequest, NextResponse } from 'next/server';
import { getContentCollection } from '@/lib/mongodb';
import { requireRole } from '@/lib/middleware';
import { ObjectId } from 'mongodb';

async function handleGetAllContent(request: NextRequest, user: any) {
  try {
    const contentCollection = await getContentCollection();

    // Get query parameters for pagination and filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const accessLevel = searchParams.get('accessLevel');

    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};
    if (category) {
      filter.category = category;
    }
    if (accessLevel) {
      filter.accessLevel = accessLevel;
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
    });
  } catch (error) {
    console.error('Get content error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleDeleteContent(request: NextRequest, user: any) {
  try {
    const body = await request.json();
    const { contentId } = body;

    if (!contentId) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      );
    }

    const contentCollection = await getContentCollection();

    const result = await contentCollection.deleteOne({
      _id: new ObjectId(contentId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Content deleted successfully',
    });
  } catch (error) {
    console.error('Delete content error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireRole('admin')(handleGetAllContent);
export const DELETE = requireRole('admin')(handleDeleteContent);