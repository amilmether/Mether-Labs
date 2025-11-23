# Mether Workspace

A high-performance personal website acting as both a Developer Portfolio and a Freelance Agency hub.

## Tech Stack

- **Frontend**: Next.js 14+, React, Tailwind CSS, Framer Motion, Three.js
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL (or SQLite for dev)
- **Auth**: OAuth2 with JWT (HS256)

## Setup & Run

### Prerequisites
- Python 3.10+
- Node.js 18+

### Backend

1. Navigate to `backend` folder.
2. Create virtual environment: `python3 -m venv venv`
3. Activate: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Run server: `uvicorn backend.main:app --reload --port 8000`

**Initial Admin Setup:**
Run this curl command to create the admin user:
```bash
curl -X POST "http://localhost:8000/setup-admin" -H "Content-Type: application/json" -d '{"username": "admin", "password": "password123"}'
```

### Frontend

1. Navigate to `frontend` folder.
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`
4. Open `http://localhost:3000`

## Features

- **Bento Grid Layout**: Responsive, glassmorphism design.
- **3D Background**: Interactive Three.js Icosahedron and particle field.
- **Admin Panel**: Secure dashboard at `/admin` to manage projects and testimonials.
- **LinkedIn Import**: Upload CSV to bulk import certifications.
- **Analytics**: Anonymous visitor tracking.
