import { NextRequest, NextResponse } from 'next/server';
import { saveThumbnail } from '@/lib/upload';
import { requireAuth } from '@/lib/middleware';

async function handleThumbnailUpload(request: NextRequest, user: any) {
  try {
    const formData = await request.formData();
    const file = formData.get('thumbnail') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Save file and get path
    const thumbnailPath = await saveThumbnail(file);

    return NextResponse.json({
      message: 'Thumbnail uploaded successfully',
      thumbnailPath,
    });
  } catch (error) {
    console.error('Thumbnail upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(handleThumbnailUpload);