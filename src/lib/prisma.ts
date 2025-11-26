import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// Modify DATABASE_URL to disable prepared statements for Supabase pooler
const getDatabaseUrl = () => {
    const url = process.env.DATABASE_URL || '';
    // Add pgbouncer=true parameter if using Supabase pooler (port 6543)
    if (url.includes(':6543/')) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}pgbouncer=true`;
    }
    return url;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
        db: {
            url: getDatabaseUrl(),
        },
    },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
