import { NextRequest, NextResponse } from 'next/server';
import { uploadToS3 } from '../../../lib/s3';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to S3
    const imageUrl = await uploadToS3(buffer, file.name, file.type);

    if (projectId) {
      // Return URL for existing project update
      return NextResponse.json({
        success: true,
        message: 'Image uploaded successfully to S3',
        imageUrl
      });
    } else {
      // Return URL for new project
      return NextResponse.json({
        success: true,
        message: 'Image uploaded successfully to S3',
        imageUrl
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file to S3' },
      { status: 500 }
    );
  }
}
