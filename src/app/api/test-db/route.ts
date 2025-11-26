import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Test connection
        await prisma.$connect();

        // Get database info
        const dbInfo: any = await prisma.$queryRaw`SELECT current_database() as database, current_user as user, version()`;

        // Count records in each table
        const [
            userCount,
            profileCount,
            projectCount,
            serviceCount,
            messageCount,
            testimonialCount,
            experienceCount,
            timelineCount,
            skillCategoryCount,
            skillCount,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.profile.count(),
            prisma.project.count(),
            prisma.service.count(),
            prisma.message.count(),
            prisma.testimonial.count(),
            prisma.experience.count(),
            prisma.timelineItem.count(),
            prisma.skillCategory.count(),
            prisma.skill.count(),
        ]);

        return NextResponse.json({
            status: '✅ Connected',
            database: dbInfo[0]?.database || 'unknown',
            user: dbInfo[0]?.user || 'unknown',
            provider: 'Supabase PostgreSQL',
            tables: {
                users: userCount,
                profiles: profileCount,
                projects: projectCount,
                services: serviceCount,
                messages: messageCount,
                testimonials: testimonialCount,
                experiences: experienceCount,
                timeline: timelineCount,
                skillCategories: skillCategoryCount,
                skills: skillCount,
            },
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
        });
    } catch (error: any) {
        console.error('Database test error:', error);

        return NextResponse.json({
            status: '❌ Error',
            message: error.message,
            code: error.code,
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
