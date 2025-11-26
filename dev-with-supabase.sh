#!/bin/bash

# Run local dev server with Supabase database
# This script sets up environment to use Supabase

echo "🚀 Starting local dev server with Supabase database..."
echo ""
echo "⚠️  Note: Your network cannot directly reach Supabase (IPv6 issue)"
echo "📝 Recommended: Use SQLite locally, PostgreSQL on Vercel"
echo ""
echo "Alternative: Run this on a VPS or use Cloudflare WARP"
echo ""

# Try to use Supabase connection
export DATABASE_URL="postgresql://postgres.chnmvsgrozzhgabbosbp:8sQ@e\$cvTTGdatX@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Generate Prisma client for PostgreSQL
echo "Generating Prisma client..."
npx prisma generate --schema=./prisma/schema.production.prisma

# Start Next.js dev server
echo "Starting Next.js..."
npm run dev
