import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Seeding production database...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('password', 10);

    const existingUser = await prisma.user.findUnique({
        where: { username: 'admin' },
    });

    if (!existingUser) {
        await prisma.user.create({
            data: {
                username: 'admin',
                hashed_password: hashedPassword,
            },
        });
        console.log('✅ Admin user created');
    } else {
        console.log('ℹ️  Admin user already exists');
    }

    console.log('📝 Username: admin');
    console.log('📝 Password: password');
    console.log('⚠️  IMPORTANT: Change the password after first login!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
