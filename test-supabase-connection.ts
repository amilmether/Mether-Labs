import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
    console.log('🔍 Testing Supabase connection...\n');

    try {
        // Test 1: Basic connection
        console.log('1️⃣  Testing database connection...');
        await prisma.$connect();
        console.log('✅ Connected to database!\n');

        // Test 2: Query execution
        console.log('2️⃣  Testing query execution...');
        const result = await prisma.$queryRaw`SELECT current_database(), current_user, version()`;
        console.log('✅ Query executed successfully!');
        console.log('📊 Database info:', result);
        console.log('');

        // Test 3: Check tables
        console.log('3️⃣  Checking if tables exist...');
        const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
        console.log('✅ Tables found:', tables);
        console.log('');

        // Test 4: Count records
        console.log('4️⃣  Checking table data...');
        const userCount = await prisma.user.count();
        const projectCount = await prisma.project.count();
        const messageCount = await prisma.message.count();

        console.log('✅ Record counts:');
        console.log(`   - Users: ${userCount}`);
        console.log(`   - Projects: ${projectCount}`);
        console.log(`   - Messages: ${messageCount}`);
        console.log('');

        console.log('🎉 All tests passed! Supabase is connected and working!\n');

    } catch (error: any) {
        console.error('❌ Connection test failed!\n');
        console.error('Error details:', error.message);

        if (error.code === 'P1001') {
            console.error('\n💡 Tip: Cannot reach database server.');
            console.error('   - Check your DATABASE_URL');
            console.error('   - Verify Supabase project is running');
            console.error('   - Check network connectivity (IPv6 issue?)');
        } else if (error.code === 'P1017') {
            console.error('\n💡 Tip: Server has closed the connection.');
            console.error('   - Try using the connection pooler URL');
        }

        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
