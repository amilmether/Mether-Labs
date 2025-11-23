import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Creating admin user...');

    const hashedPassword = await bcrypt.hash('password', 10);

    const user = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            hashed_password: hashedPassword,
        },
    });

    console.log('✅ Admin user created:', user.username);
    console.log('📝 Username: admin');
    console.log('📝 Password: password');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
