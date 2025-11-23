import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET() {
    try {
        const experience = await prisma.experience.findMany({
            orderBy: { id: 'desc' }, // Or sort by start_date if I parse it
        });
        return NextResponse.json(experience);
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
        const experience = await prisma.experience.create({
            data: {
                title: body.title,
                company: body.company,
                start_date: body.start_date,
                end_date: body.end_date,
                current: body.current || false,
                description: body.description,
            },
        });

        return NextResponse.json(experience);
    } catch (error) {
        return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
    }
}
