import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET() {
    try {
        const services = await prisma.service.findMany({
            orderBy: { id: 'desc' },
        });

        const parsedServices = services.map(service => ({
            ...service,
            deliverables: JSON.parse(service.deliverables),
            stack: JSON.parse(service.stack),
        }));

        return NextResponse.json(parsedServices);
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

        const service = await prisma.service.create({
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
