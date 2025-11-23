# 🚀 Deployment Guide: Vercel + Supabase + Render/Railway

This guide explains how to deploy your full-stack portfolio application.

## 🏗️ Architecture
- **Frontend**: Hosted on **Vercel** (Next.js).
- **Backend**: Hosted on **Render** or **Railway** (FastAPI).
- **Database**: **Supabase** (PostgreSQL).
- **Storage**: **Supabase Storage** (Images).

---

## 1. Database & Storage Setup (Supabase)

1.  **Create Project**: Go to [Supabase](https://supabase.com) and create a new project.
2.  **Get Credentials**:
    - Go to **Project Settings > Database**. Copy the **Connection String (URI)**.
    - Go to **Project Settings > API**. Copy the **Project URL** and **anon public key**.
3.  **Setup Storage**:
    - Go to **Storage** in sidebar.
    - Create a new bucket named `portfolio-images`.
    - Make it **Public**.
4.  **Migrate Data**:
    - Since you are moving from SQLite to Postgres, you'll need to recreate tables.
    - Supabase has a SQL Editor. You can let SQLAlchemy create tables automatically when the backend starts, OR run a migration script.
    - *Tip*: The backend code `models.Base.metadata.create_all(bind=database.engine)` will automatically create tables if they don't exist when connected to Postgres.

---

## 2. Backend Deployment (Render/Railway)

We recommend **Render** (has a free tier) or **Railway** (easier setup).

### Option A: Render
1.  Push your code to **GitHub**.
2.  Go to [Render](https://render.com) > New > **Web Service**.
3.  Connect your GitHub repo.
4.  **Settings**:
    - **Root Directory**: `.` (or leave empty if root)
    - **Build Command**: `pip install -r backend/requirements.txt`
    - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
5.  **Environment Variables**:
    - `DATABASE_URL`: Paste your Supabase Connection String (replace `postgres://` with `postgresql://` if needed).
    - `SMTP_USER`: Your Gmail address.
    - `SMTP_PASSWORD`: Your Gmail App Password.
    - `FRONTEND_URL`: `https://your-vercel-app.vercel.app` (you'll get this in Step 3).
    - `SECRET_KEY`: Generate a random string (e.g., `openssl rand -hex 32`).

### Option B: Railway
1.  Go to [Railway](https://railway.app) > New Project > GitHub.
2.  Select your repo.
3.  Add variables in the dashboard same as above.
4.  Railway automatically detects Python/requirements.txt.

---

## 3. Frontend Deployment (Vercel)

1.  Go to [Vercel](https://vercel.com) > Add New > Project.
2.  Import your GitHub repo.
3.  **Build Settings**:
    - **Framework Preset**: Next.js (default).
    - **Root Directory**: `frontend` (Important! Since your frontend is in a subdirectory).
4.  **Environment Variables**:
    - `NEXT_PUBLIC_API_URL`: The URL of your deployed backend (e.g., `https://your-app.onrender.com`).
5.  **Deploy**.

---

## 4. Code Changes Required

### A. Frontend Config
We created `frontend/src/config.ts` to handle the API URL.
**Action**: You must replace ALL hardcoded `http://localhost:8000` in your frontend code with `API_URL` imported from `@/config`.

Example:
```typescript
import { API_URL } from "@/config";
// ...
axios.get(`${API_URL}/api/projects`)
```

### B. Image Uploads (Supabase Storage)
Currently, images are saved to the local filesystem (`uploads/`). This **will not work** on Render/Vercel because the filesystem is ephemeral (deleted on restart).

**You must update `backend/main.py` to upload to Supabase Storage.**

Install supabase client:
`pip install supabase`

Update `backend/main.py`:
```python
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

@app.post("/api/upload-image")
async def upload_image(file: UploadFile = File(...)):
    # ... validation ...
    file_content = await file.read()
    res = supabase.storage.from_("portfolio-images").upload(filename, file_content)
    public_url = supabase.storage.from_("portfolio-images").get_public_url(filename)
    return {"url": public_url}
```

---

## 5. Security Checklist 🔒

1.  **SQL Injection**: We use **SQLAlchemy** ORM, which automatically parameterizes queries, preventing most SQL injection attacks.
2.  **CORS**: We configured CORS to only allow your frontend URL.
3.  **Secrets**: Never commit `.env` files. Use the dashboard variables.
4.  **Auth**: Ensure `SECRET_KEY` is strong and unique in production.
5.  **Rate Limiting**: Consider adding `slowapi` to FastAPI if you expect high traffic.

---

## Summary
1.  **Push** code to GitHub.
2.  **Deploy Backend** to Render (set env vars).
3.  **Deploy Frontend** to Vercel (set `NEXT_PUBLIC_API_URL`).
4.  **Update Code** to use Supabase Storage for images.
