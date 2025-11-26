#!/bin/bash

# View Supabase Database with Prisma Studio
echo "🔍 Opening Prisma Studio for Supabase database..."
echo "📊 URL: http://localhost:5555"
echo ""

DATABASE_URL="postgresql://postgres.chnmvsgrozzhgabbosbp:8sQ@e\$cvTTGdatX@aws-1-ap-south-1.pooler.supabase.com:6543/postgres" \
npx prisma studio --schema=./prisma/schema.production.prisma
