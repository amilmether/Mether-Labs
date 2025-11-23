import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = getTokenFromRequest(request);
        if (!token || !verifyToken(token)) {
            return NextResponse.json(
                { detail: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();

        const service = await prisma.service.update({
            where: { id: parseInt(params.id) },
            data: {
                ...body,
                deliverables: JSON.stringify(body.deliverables),
                stack: JSON.stringify(body.stack),
            },
        });

        return NextResponse.json({
            ...service,
            deliverables: JSON.parse(service.deliverables),
            stack: JSON.parse(service.stack),
        });
    } catch (error) {
        return NextResponse.json(
            { detail: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = getTokenFromRequest(request);
        if (!token || !verifyToken(token)) {
            return NextResponse.json(
                { detail: 'Unauthorized' },
                { status: 401 }
            );
        }

        await prisma.service.delete({
            where: { id: parseInt(params.id) },
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        return NextResponse.json(
            { detail: 'Internal server error' },
            { status: 500 }
        );
    }
}
