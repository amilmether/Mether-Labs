# 🚀 Migrating to Neon Database

Neon is a serverless PostgreSQL database that is perfect for Vercel. It solves the connectivity issues we faced with Supabase.

## Step 1: Create Neon Project

1. Go to [neon.tech](https://neon.tech) and Sign Up.
2. Click **Create a project**.
3. Name it `mether-labs` (or similar).
4. Select the region closest to you (e.g., `AWS ap-south-1` if you are in India).
5. Click **Create project**.

## Step 2: Get Connection String

1. On your Neon Dashboard, look for the **Connection Details** section.
2. Ensure **Pooled connection** is checked (optional but good for Vercel, though Neon handles connections well).
3. Copy the Connection String. It looks like:
   ```
   postgresql://neondb_owner:AbCdEf123456@ep-cool-frog-123456.ap-south-1.aws.neon.tech/neondb?sslmode=require
   ```

## Step 3: Update Vercel Environment Variables

1. Go to your Vercel Project Dashboard.
2. Navigate to **Settings** -> **Environment Variables**.
3. Edit `DATABASE_URL`.
4. Paste your **Neon Connection String**.
5. Click **Save**.

## Step 4: Deploy

1. Go to the **Deployments** tab in Vercel.
2. Click the **three dots** (...) on the latest deployment and select **Redeploy**.
3. **Success!** Vercel will now:
   - Build your app.
   - Automatically push the database schema to Neon (creating all tables).
   - Deploy the site.

## Step 5: Seed the Database (Create Admin User)

Once deployed, you need to create your admin user.

### Option A: Run Seed Script Locally (If you have IPv4 access)

If your local network allows connecting to Neon (Neon supports IPv4, so this should work!):

1. Update your local `.env` file temporarily:
   ```env
   DATABASE_URL="your_neon_connection_string"
   ```
2. Run the seed script:
   ```bash
   npx tsx --env-file=.env prisma/seed.production.ts
   ```

### Option B: Use Neon SQL Editor

1. Go to the **Neon Dashboard**.
2. Click **SQL Editor** in the sidebar.
3. Paste and run this SQL:

```sql
INSERT INTO "User" (username, hashed_password)
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy')
ON CONFLICT (username) DO NOTHING;
```

## Step 6: Verify

Visit `https://your-app.vercel.app/admin/login` and login with:
- **Username:** `admin`
- **Password:** `password`

---

**Why Neon?**
- Native IPv4 support (solves local connection issues).
- Serverless architecture (scales to zero when not used).
- Branching workflow (great for development).
