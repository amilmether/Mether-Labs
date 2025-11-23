import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET() {
    try {
        const profile = await prisma.profile.findFirst();

        if (!profile) {
            return NextResponse.json({
                id: 0,
                name: 'Amil Mether',
                bio: 'Full Stack Engineer',
                role: 'Developer',
                location: 'Kottayam, Kerala, India',
                status: 'Available',
                whatsapp: '',
            });
        }

        return NextResponse.json(profile);
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

        let profile = await prisma.profile.findFirst();

        if (!profile) {
            profile = await prisma.profile.create({
                data: body,
            });
        } else {
            profile = await prisma.profile.update({
                where: { id: profile.id },
                data: body,
            });
        }

        return NextResponse.json(profile);
    } catch (error) {
        return NextResponse.json(
            { detail: 'Internal server error' },
            { status: 500 }
        );
    }
}
