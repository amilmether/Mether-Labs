# Deployment Guide (Vercel + Supabase + Cloudinary)

To host your portfolio on Vercel, we need to move away from the local SQLite database and local file storage, as Vercel is a serverless platform with an ephemeral filesystem.

## 1. Prerequisites

### A. Database (Supabase)
1.  Go to [Supabase](https://supabase.com/) and create a free account.
2.  Create a new project.
3.  Go to **Project Settings** -> **Database**.
4.  Copy the **Connection String** (URI). It looks like `postgresql://postgres:[PASSWORD]@db.supabase.co:5432/postgres`.
    *   *Note: You will need two versions of this string for Prisma:*
    *   **Transaction Mode**: Port 6543 (usually used for `DATABASE_URL`)
    *   **Session Mode**: Port 5432 (used for `DIRECT_URL` migrations)
    *   *Actually, for simple setups, just use the standard connection string for both if you don't have high concurrency.*

### B. Image Storage (Cloudinary)
1.  Go to [Cloudinary](https://cloudinary.com/) and create a free account.
2.  Go to your **Dashboard**.
3.  Copy your **Cloud Name**, **API Key**, and **API Secret**.

## 2. Install Dependencies

Run this command in your terminal to install the Cloudinary SDK:

```bash
npm install cloudinary
```

## 3. Environment Variables

Create a new `.env.production` file (or add to Vercel Environment Variables) with the following:

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres"

# Auth
JWT_SECRET="your-super-secret-jwt-key"

# Email (Gmail)
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## 4. Update Codebase

I have automatically updated the following files for you:
1.  `prisma/schema.prisma`: Switched to PostgreSQL.
2.  `src/app/api/upload-image/route.ts`: Switched to Cloudinary.

## 5. Deploy to Vercel

1.  Push your code to GitHub.
2.  Go to [Vercel](https://vercel.com/) and import your repository.
3.  In the **Environment Variables** section, add all the variables from step 3.
4.  **Build Command**: `npx prisma generate && next build` (Vercel usually detects this).
5.  **Install Command**: `npm install` (Default).
6.  Deploy!

## 6. Post-Deployment

After deployment, Vercel will build your app. You might need to run the migrations on your production database. You can do this from your local machine if you update your local `.env` to point to the Supabase DB, or run it as a build step.

**Recommended**: Run this locally pointing to Supabase:
```bash
npx prisma db push
```
