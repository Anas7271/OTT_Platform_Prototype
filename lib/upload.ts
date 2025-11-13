import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export const uploadDir = process.env.UPLOAD_DIR || './public/uploads/thumbnails';
const maxSize = parseInt(process.env.MAX_FILE_SIZE || '5242880'); // 5MB default

export async function ensureUploadDir() {
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }
}

export async function saveThumbnail(file: File): Promise<string> {
  await ensureUploadDir();

  if (file.size > maxSize) {
    throw new Error('File size exceeds limit');
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${file.type.split('/')[1]}`;
  const filepath = join(uploadDir, filename);

  await writeFile(filepath, buffer);

  // Return the relative path for database storage
  return `/uploads/thumbnails/${filename}`;
}

export function getThumbnailPath(path: string): string {
  if (path.startsWith('/')) {
    return path;
  }
  return `/${path}`;
}