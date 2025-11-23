import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const skills = await prisma.skill.findMany();
        return NextResponse.json(skills);
    } catch (error) {
        return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = getTokenFromRequest(request);
        if (!token || !verifyToken(token)) {
            return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const skill = await prisma.skill.create({
            data: {
                name: body.name,
                category: body.category, // This expects the category name string as per schema
            },
        });

        return NextResponse.json(skill);
    } catch (error) {
        return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
    }
}
