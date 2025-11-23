import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
    try {
        // 1. Auth Check
        const token = getTokenFromRequest(request);
        if (!token || !verifyToken(token)) {
            return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
        }

        // 2. Get File
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ detail: 'No file uploaded' }, { status: 400 });
        }

        // 3. Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 4. Upload to Cloudinary (via Stream)
        const result = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'portfolio_uploads', // Optional: organize in a folder
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        // 5. Return URL
        return NextResponse.json({
            url: result.secure_url,
            public_id: result.public_id
        });

    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { detail: 'Upload failed: ' + (error.message || 'Unknown error') },
            { status: 500 }
        );
    }
}
