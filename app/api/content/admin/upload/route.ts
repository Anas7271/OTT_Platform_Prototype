import { NextRequest, NextResponse } from 'next/server';
import { getContentCollection, getUsersCollection } from '@/lib/mongodb';
import { Content, CreateContentInput } from '@/lib/models/Content';
import { requireRole } from '@/lib/middleware';
import { ObjectId } from 'mongodb';

async function handleContentUpload(request: NextRequest, user: any) {
  try {
    const body: CreateContentInput = await request.json();
    const { title, description, category, thumbnailPath, accessLevel = 'everyone' } = body;

    // Validate input
    if (!title || !description || !category || !thumbnailPath) {
      return NextResponse.json(
        { error: 'Title, description, category, and thumbnailPath are required' },
        { status: 400 }
      );
    }

    // Validate access level
    const validAccessLevels = ['everyone', 'lite', 'premium'];
    if (!validAccessLevels.includes(accessLevel)) {
      return NextResponse.json(
        { error: 'Invalid access level' },
        { status: 400 }
      );
    }

    const contentCollection = await getContentCollection();
    const usersCollection = await getUsersCollection();

    // Get user ID
    const userRecord = await usersCollection.findOne({ email: user.email });
    if (!userRecord) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create new content
    const newContent: Omit<Content, '_id'> = {
      title,
      description,
      category,
      thumbnailPath,
      uploadedBy: userRecord._id.toString(),
      accessLevel,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await contentCollection.insertOne(newContent as any);

    return NextResponse.json(
      {
        message: 'Content uploaded successfully',
        content: {
          ...newContent,
          _id: result.insertedId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Content upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = requireRole('admin')(handleContentUpload);