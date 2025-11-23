import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET() {
    try {
        const content = await prisma.aboutContent.findFirst();

        if (!content) {
            return NextResponse.json({
                id: 0,
                intro1: '',
                intro2: '',
            });
        }

        return NextResponse.json(content);
    } catch (error) {
        return NextResponse.json(
            { detail: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const token = getTokenFromRequest(request);
        if (!token || !verifyToken(token)) {
            return NextResponse.json(
                { detail: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();

        let content = await prisma.aboutContent.findFirst();

        if (!content) {
            content = await prisma.aboutContent.create({
                data: body,
            });
        } else {
            content = await prisma.aboutContent.update({
                where: { id: content.id },
                data: body,
            });
        }

        return NextResponse.json(content);
    } catch (error) {
        return NextResponse.json(
            { detail: 'Internal server error' },
            { status: 500 }
        );
    }
}
