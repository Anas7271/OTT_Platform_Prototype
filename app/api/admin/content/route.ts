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

// GET: Fetch all content (admin only)
export async function GET(request: NextRequest) {
  try {
    const decoded = authenticateUser(request);

    if (decoded.role !== 'admin') {
      console.error('Access denied: User role is not admin:', decoded.role);
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    await connectToDatabase();
    const content = await Content.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ content });
  } catch (error: any) {
    console.error('GET content error:', error);
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