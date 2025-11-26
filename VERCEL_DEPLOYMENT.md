# Vercel Deployment Guide

## Current Status
✅ Code is ready for deployment
✅ Dual database setup (SQLite local, PostgreSQL production)
✅ Build script configured for Vercel

## Quick Deploy Steps

### 1. Verify Vercel Environment Variables

Go to your Vercel project → Settings → Environment Variables and ensure these are set:

```
DATABASE_URL = postgresql://postgres.chnmvsgrozzhgabbosbp:8sQ@e$cvTTGdatX@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
CLOUDINARY_CLOUD_NAME = your_cloud_name
CLOUDINARY_API_KEY = your_api_key
CLOUDINARY_API_SECRET = your_api_secret
JWT_SECRET = your-secret-key-123
SMTP_USER = amilmether.dev@gmail.com
SMTP_PASSWORD = your_gmail_app_password
```

### 2. Deploy

Your code is already pushed to GitHub. Vercel will automatically deploy.

Or manually trigger:
1. Go to Vercel dashboard
2. Click your project
3. Go to Deployments tab
4. Click "Redeploy" on latest deployment

### 3. Seed Production Database

After successful deployment, run this command locally:

```bash
# Set production DATABASE_URL temporarily
export DATABASE_URL="postgresql://postgres.chnmvsgrozzhgabbosbp:8sQ@e$cvTTGdatX@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"

# Run production seed
npx tsx --env-file=.env.production prisma/seed.production.ts
```

Or create admin user manually via Supabase SQL Editor:
```sql
INSERT INTO "User" (username, hashed_password)
VALUES ('admin', '$2a$10$YourHashedPasswordHere');
```

### 4. Test Your Site

1. Visit your Vercel URL
2. Go to `/admin/login`
3. Login with: `admin` / `password`
4. **IMPORTANT**: Change the password immediately!

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Verify all environment variables are set
- Ensure DATABASE_URL is correct

### Database Connection Error
- Verify Supabase project is running
- Check DATABASE_URL format
- Ensure Supabase allows connections from Vercel

### Admin Login Doesn't Work
- Seed the production database (step 3)
- Check if User table exists in Supabase

## Your Deployment URLs

- **Production**: https://your-project.vercel.app
- **Admin Panel**: https://your-project.vercel.app/admin

---

**Note**: Your local development uses SQLite (`prisma/dev.db`), while production uses PostgreSQL (Supabase).
