import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET() {
    try {
        const about = await prisma.aboutContent.findFirst();
        return NextResponse.json(about || { intro1: '', intro2: '' });
    } catch (error) {
        return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = getTokenFromRequest(request);
        if (!token || !verifyToken(token)) {
            return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Upsert: update if exists, create if not
        const about = await prisma.aboutContent.upsert({
            where: { id: 1 }, // Assuming single record with ID 1
            update: {
                intro1: body.intro1,
                intro2: body.intro2,
            },
            create: {
                id: 1,
                intro1: body.intro1,
                intro2: body.intro2,
            },
        });

        return NextResponse.json(about);
    } catch (error) {
        return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
    }
}
