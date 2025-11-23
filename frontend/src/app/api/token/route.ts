import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        if (!username || !password) {
            return NextResponse.json(
                { detail: 'Username and password required' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user || !(await verifyPassword(password, user.hashed_password))) {
            return NextResponse.json(
                { detail: 'Incorrect username or password' },
                { status: 401 }
            );
        }

        const access_token = createToken(user.username);

        return NextResponse.json({
            access_token,
            token_type: 'bearer',
        });
    } catch (error) {
        return NextResponse.json(
            { detail: 'Internal server error' },
            { status: 500 }
        );
    }
}
