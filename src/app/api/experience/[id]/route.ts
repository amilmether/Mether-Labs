import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const token = getTokenFromRequest(request);
        if (!token || !verifyToken(token)) {
            return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const experience = await prisma.experience.update({
            where: { id: parseInt(id) },
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
        console.error("Experience update error:", error);
        return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const token = getTokenFromRequest(request);
        if (!token || !verifyToken(token)) {
            return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        await prisma.experience.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Experience delete error:", error);
        return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
    }
}
