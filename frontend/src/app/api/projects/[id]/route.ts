import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const project = await prisma.project.findUnique({
            where: { id: parseInt(id) },
        });

        if (!project) {
            return NextResponse.json(
                { detail: 'Project not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            ...project,
            stack: JSON.parse(project.stack),
            images: JSON.parse(project.images),
        });
    } catch (error) {
        return NextResponse.json(
            { detail: 'Internal server error' },
            { status: 500 }
        );
    }
}

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

        // Ensure stack and images are arrays
        const stack = Array.isArray(body.stack) ? body.stack : [];
        const images = Array.isArray(body.images) ? body.images : [];

        const project = await prisma.project.update({
            where: { id: parseInt(id) },
            data: {
                title: body.title,
                slug: body.slug,
                short_description: body.short_description,
                detailed_description: body.detailed_description,
                category: body.category,
                priority: body.priority || 'Medium',
                link: body.link || null,
                github_link: body.github_link || null,
                featured: body.featured || false,
                stack: JSON.stringify(stack),
                images: JSON.stringify(images),
            },
        });

        return NextResponse.json({
            ...project,
            stack: JSON.parse(project.stack),
            images: JSON.parse(project.images),
        });
    } catch (error) {
        console.error('Project update error:', error);
        return NextResponse.json(
            { detail: error instanceof Error ? error.message : 'Internal server error' },
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

        await prisma.project.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Project delete error:', error);
        return NextResponse.json(
            { detail: 'Internal server error' },
            { status: 500 }
        );
    }
}
