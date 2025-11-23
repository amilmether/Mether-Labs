import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const featured = searchParams.get('featured') === 'true';

        const projects = await prisma.project.findMany({
            where: featured ? { featured: true } : undefined,
            orderBy: { id: 'desc' },
        });

        // Parse JSON strings back to arrays
        const parsedProjects = projects.map(project => ({
            ...project,
            stack: JSON.parse(project.stack),
            images: JSON.parse(project.images),
        }));

        return NextResponse.json(parsedProjects);
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

        // Ensure stack and images are arrays
        const stack = Array.isArray(body.stack) ? body.stack : [];
        const images = Array.isArray(body.images) ? body.images : [];

        const project = await prisma.project.create({
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
        console.error('Project creation error:', error);
        return NextResponse.json(
            { detail: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
