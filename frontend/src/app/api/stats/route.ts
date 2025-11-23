import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const totalViews = await prisma.analytics.count();
        const uniqueVisitors = await prisma.analytics.findMany({
            distinct: ['ip_hash'],
            select: { ip_hash: true },
        });

        return NextResponse.json({
            total_views: totalViews,
            unique_visitors: uniqueVisitors.length,
        });
    } catch (error) {
        return NextResponse.json(
            { detail: 'Internal server error' },
            { status: 500 }
        );
    }
}
