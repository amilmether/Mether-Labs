# Vercel Deployment - Final Steps

## ✅ What I Just Fixed

Removed `prisma db push` from the build script because Vercel build servers also have IPv6 connectivity issues with Supabase.

## 🚀 Deploy to Vercel

### Step 1: Update Environment Variables

Go to Vercel → Your Project → Settings → Environment Variables

**Update `DATABASE_URL` to use the TRANSACTION POOLER:**

```
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.thgaxpgxvpgmdzdaijts.supabase.co:6543/postgres
```

**Important Notes:**
- Use port **6543** (not 5432)
- Format: `postgres://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:6543/postgres`
- The `pgbouncer=true` parameter is added automatically by the code

**To get your connection string:**
1. Supabase Dashboard → Project Settings → Database
2. Click **Connection string** → Select **Transaction pooler**
3. Copy the URI (it will have port 6543)
4. Replace `[YOUR_PASSWORD]` with your actual database password

### Step 2: Push Code & Deploy

```bash
git add -A
git commit -m "Fix build script for Vercel deployment"
git push
```

Vercel will auto-deploy. The build should succeed now!

### Step 3: Create Database Tables (After Deployment)

Since we removed `db push` from build, you need to create tables manually.

**Option A: Using Supabase SQL Editor** (Easiest)

1. Go to Supabase Dashboard → SQL Editor
2. Click **New Query**
3. Paste this SQL:

```sql
-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL
);

-- Create Profile table
CREATE TABLE IF NOT EXISTS "Profile" (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    bio TEXT NOT NULL,
    role TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL,
    whatsapp TEXT
);

-- Create Project table
CREATE TABLE IF NOT EXISTS "Project" (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT NOT NULL,
    detailed_description TEXT NOT NULL,
    stack TEXT NOT NULL,
    category TEXT NOT NULL,
    priority TEXT NOT NULL,
    link TEXT,
    github_link TEXT,
    images TEXT NOT NULL,
    featured BOOLEAN DEFAULT false NOT NULL
);

-- Create Service table
CREATE TABLE IF NOT EXISTS "Service" (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    short_description TEXT NOT NULL,
    detailed_description TEXT NOT NULL,
    price_from TEXT NOT NULL,
    deliverables TEXT NOT NULL,
    stack TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL
);

-- Create Message table
CREATE TABLE IF NOT EXISTS "Message" (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    type TEXT NOT NULL,
    budget TEXT,
    whatsapp TEXT,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create Testimonial table
CREATE TABLE IF NOT EXISTS "Testimonial" (
    id SERIAL PRIMARY KEY,
    client_name TEXT NOT NULL,
    role TEXT NOT NULL,
    text TEXT NOT NULL
);

-- Create AboutContent table
CREATE TABLE IF NOT EXISTS "AboutContent" (
    id SERIAL PRIMARY KEY,
    intro1 TEXT NOT NULL,
    intro2 TEXT NOT NULL
);

-- Create Experience table
CREATE TABLE IF NOT EXISTS "Experience" (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT,
    current BOOLEAN DEFAULT false NOT NULL,
    description TEXT NOT NULL
);

-- Create TimelineItem table
CREATE TABLE IF NOT EXISTS "TimelineItem" (
    id SERIAL PRIMARY KEY,
    start_date TEXT NOT NULL,
    end_date TEXT,
    current BOOLEAN DEFAULT false NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL
);

-- Create SkillCategory table
CREATE TABLE IF NOT EXISTS "SkillCategory" (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL
);

-- Create Skill table
CREATE TABLE IF NOT EXISTS "Skill" (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    FOREIGN KEY (category) REFERENCES "SkillCategory"(name) ON DELETE CASCADE
);

-- Create Analytics table
CREATE TABLE IF NOT EXISTS "Analytics" (
    id SERIAL PRIMARY KEY,
    ip_hash TEXT NOT NULL,
    path TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create admin user (password: "password")
INSERT INTO "User" (username, hashed_password)
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy')
ON CONFLICT (username) DO NOTHING;
```

4. Click **Run** (or press Ctrl+Enter)
5. You should see "Success. No rows returned"

### Step 4: Verify Deployment

1. Visit: `https://your-app.vercel.app/api/test-db`
2. You should see:
   ```json
   {
     "status": "✅ Connected",
     "tables": { ... }
   }
   ```

3. Login to admin: `https://your-app.vercel.app/admin/login`
   - Username: `admin`
   - Password: `password`

## 🎉 Done!

Your app is now deployed with Supabase database!

## 📝 Important Notes

- **Change admin password** immediately after first login
- **Connection pooler** is required for Supabase
- **Database tables** must be created manually (SQL above)
- **Test endpoint** `/api/test-db` verifies connection

---

**Need help?** Check the build logs in Vercel for any errors.
