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
        const category = await prisma.skillCategory.update({
            where: { id: parseInt(id) },
            data: {
                name: body.name,
                display_order: body.display_order,
            },
            include: { skills: true },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error("Skill Category update error:", error);
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

        await prisma.skillCategory.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Skill Category delete error:", error);
        return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
    }
}
