import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = getTokenFromRequest(request);
        if (!token || !verifyToken(token)) {
            return NextResponse.json(
                { detail: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await request.json();

        const item = await prisma.timelineItem.update({
            where: { id: parseInt(id) },
            data: body,
        });

        return NextResponse.json(item);
    } catch (error) {
        console.error("Timeline update error:", error);
        return NextResponse.json(
            { detail: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = getTokenFromRequest(request);
        if (!token || !verifyToken(token)) {
            return NextResponse.json(
                { detail: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;

        await prisma.timelineItem.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Timeline delete error:", error);
        return NextResponse.json(
            { detail: 'Internal server error' },
            { status: 500 }
        );
    }
}
