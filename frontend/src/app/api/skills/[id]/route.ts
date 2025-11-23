import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const token = getTokenFromRequest(request);
        if (!token || !verifyToken(token)) {
            return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        await prisma.skill.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Skill delete error:", error);
        return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
    }
}
