import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { connectToDatabase } from '@/lib/mongodb';
import { Content } from '@/lib/models/Content';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'thumbnails');

// Helper function to verify JWT token and get user info
function authenticateUser(request: NextRequest) {
  const token = getTokenFromHeaders(request.headers);
  if (!token) {
    console.error('No token provided in request headers');
    throw new Error('No token provided');
  }

  try {
    const decoded = verifyToken(token);
    console.log('Token verified successfully:', { userId: decoded.userId, role: decoded.role });
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new Error('Invalid token');
  }
}

// Helper function to ensure upload directory exists
async function ensureUploadDir() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    // Directory already exists or couldn't be created
    console.error('Upload directory error:', error);
  }
}

// GET: Fetch content uploaded by this admin only
export async function GET(request: NextRequest) {
  try {
    const decoded = authenticateUser(request);

    if (decoded.role !== 'admin') {
      console.error('Access denied: User role is not admin:', decoded.role);
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    await connectToDatabase();

    // Find content uploaded by this specific admin
    const content = await Content.find({ uploadedBy: decoded.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Content.countDocuments({ uploadedBy: decoded.userId });

    console.log('Admin content fetched:', {
      adminId: decoded.userId,
      contentCount: content.length,
      total
    });

    return NextResponse.json({
      success: true,
      content,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      admin: {
        id: decoded.userId,
        username: decoded.username
      }
    });
  } catch (error: any) {
    console.error('GET admin content error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// POST: Upload new content (admin only)
export async function POST(request: NextRequest) {
  try {
    const decoded = authenticateUser(request);

    if (decoded.role !== 'admin') {
      console.error('Access denied: User role is not admin:', decoded.role);
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const accessLevel = formData.get('accessLevel') as string;
    const thumbnail = formData.get('thumbnail') as File;

    // Validate required fields
    if (!title || !description || !category || !accessLevel || !thumbnail) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Validate access level
    const validAccessLevels = ['everyone', 'lite', 'premium'];
    if (!validAccessLevels.includes(accessLevel)) {
      return NextResponse.json({ error: 'Invalid access level' }, { status: 400 });
    }

    // Validate category
    const validCategories = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi'];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    // Validate file type and size
    if (!thumbnail.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Thumbnail must be an image file' }, { status: 400 });
    }

    if (thumbnail.size > 5 * 1024 * 1024) { // 5MB limit
      return NextResponse.json({ error: 'Thumbnail size must be less than 5MB' }, { status: 400 });
    }

    // Ensure upload directory exists
    await ensureUploadDir();

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = thumbnail.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const filename = `${timestamp}_${originalName}`;
    const filepath = join(UPLOAD_DIR, filename);

    // Save file to filesystem
    const bytes = await thumbnail.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Connect to database and save content
    await connectToDatabase();

    const newContent = new Content({
      title,
      description,
      category,
      accessLevel,
      thumbnailPath: `/uploads/thumbnails/${filename}`,
      uploadedBy: decoded.userId,
      createdAt: new Date(),
    });

    await newContent.save();

    return NextResponse.json({
      message: 'Content uploaded successfully',
      content: newContent
    });

  } catch (error: any) {
    console.error('POST content error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload content' },
      { status: 500 }
    );
  }
}

// DELETE: Delete content (admin only, only content uploaded by this admin)
export async function DELETE(request: NextRequest) {
  try {
    const decoded = authenticateUser(request);

    if (decoded.role !== 'admin') {
      console.error('Access denied: User role is not admin:', decoded.role);
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get('id');

    if (!contentId) {
      return NextResponse.json({ error: 'Content ID is required' }, { status: 400 });
    }

    await connectToDatabase();

    // Find the content and verify it was uploaded by this admin
    const content = await Content.findOne({ _id: contentId, uploadedBy: decoded.userId });

    if (!content) {
      return NextResponse.json({ error: 'Content not found or access denied' }, { status: 404 });
    }

    // Delete the thumbnail file if it exists
    if (content.thumbnailPath) {
      try {
        const fs = await import('fs/promises');
        const path = await import('path');
        const fullPath = path.join(process.cwd(), 'public', content.thumbnailPath);
        await fs.unlink(fullPath);
        console.log('Deleted thumbnail file:', fullPath);
      } catch (error) {
        console.warn('Failed to delete thumbnail file:', error);
        // Continue with content deletion even if file deletion fails
      }
    }

    // Delete the content from database
    await Content.findByIdAndDelete(contentId);

    console.log('Content deleted successfully:', {
      contentId,
      adminId: decoded.userId,
      title: content.title
    });

    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully'
    });

  } catch (error: any) {
    console.error('DELETE content error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete content' },
      { status: 500 }
    );
  }
}