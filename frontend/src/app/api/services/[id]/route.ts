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

        // Ensure deliverables and stack are arrays
        const deliverables = Array.isArray(body.deliverables) ? body.deliverables : [];
        const stack = Array.isArray(body.stack) ? body.stack : [];

        const service = await prisma.service.update({
            where: { id: parseInt(id) },
            data: {
                title: body.title,
                short_description: body.short_description,
                detailed_description: body.detailed_description || '',
                price_from: body.price_from,
                is_active: body.is_active ?? true,
                deliverables: JSON.stringify(deliverables),
                stack: JSON.stringify(stack),
            },
        });

        return NextResponse.json({
            ...service,
            deliverables: JSON.parse(service.deliverables),
            stack: JSON.parse(service.stack),
        });
    } catch (error) {
        console.error("PUT Service Error:", error);
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

        await prisma.service.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("DELETE Service Error:", error);
        return NextResponse.json(
            { detail: 'Internal server error' },
            { status: 500 }
        );
    }
}
