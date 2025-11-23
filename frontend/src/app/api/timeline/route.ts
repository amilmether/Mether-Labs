import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET() {
    try {
        const items = await prisma.timelineItem.findMany({
            orderBy: { start_date: 'desc' },
        });

        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json(
            { detail: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = getTokenFromRequest(request);
        if (!token || !verifyToken(token)) {
            return NextResponse.json(
                { detail: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();

        const item = await prisma.timelineItem.create({
            data: body,
        });

        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json(
            { detail: 'Internal server error' },
            { status: 500 }
        );
    }
}
