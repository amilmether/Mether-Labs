# Portfolio Website - Full Stack Next.js

A modern, full-stack portfolio website built with Next.js, featuring a complete admin panel for content management.

## 🚀 Tech Stack

- **Frontend**: Next.js 16 (React, TypeScript)
- **Backend**: Next.js API Routes (Serverless)
- **Database**: Prisma ORM + SQLite (dev) / PostgreSQL (production)
- **Auth**: JWT with bcrypt
- **Email**: Nodemailer (Gmail SMTP)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## ✨ Features

### Public Site
- 🏠 Homepage with featured projects
- 📁 Projects showcase
- 💼 Services listing
- 👤 About page with experience & timeline
- 📧 Contact form with email notifications
- 💬 Testimonials

### Admin Panel
- 🔐 Secure login
- ✏️ Full CRUD for all content
- 📊 Analytics dashboard
- 📬 Message management
- 🎨 Edit mode on all pages

## 🏃 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd <repo-name>
```

2. **Install dependencies**
```bash
cd frontend
npm install
```

3. **Setup environment variables**
Create `frontend/.env`:
```env
DATABASE_URL="file:./dev.db"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-gmail-app-password"
JWT_SECRET="your-random-secret-key"
```

4. **Initialize database**
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

5. **Run development server**
```bash
npm run dev
```

Visit `http://localhost:3000`

### Default Admin Credentials
- **Username**: `admin`
- **Password**: `password`

⚠️ **Change these immediately in production!**

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── api/              # API routes (backend)
│   │   ├── admin/            # Admin pages
│   │   ├── about/
│   │   ├── contact/
│   │   ├── projects/
│   │   └── services/
│   ├── components/           # React components
│   ├── lib/                  # Utilities
│   │   ├── prisma.ts
│   │   └── auth.ts
│   └── config.ts
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts
└── public/
```

## 🗄️ Database Schema

- **User** - Admin authentication
- **Profile** - Personal info
- **Project** - Portfolio projects
- **Service** - Services offered
- **Message** - Contact form submissions
- **Testimonial** - Client testimonials
- **AboutContent** - About page intro
- **Experience** - Work experience
- **TimelineItem** - Career timeline
- **SkillCategory** - Skill groupings
- **Skill** - Individual skills
- **Analytics** - Page view tracking

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push
```

2. **Deploy to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your repository
- Set **Root Directory** to `frontend`
- Add environment variables
- Deploy!

3. **Production Database (Supabase)**
- Create a Supabase project
- Get PostgreSQL connection string
- Update `DATABASE_URL` in Vercel
- Run `npx prisma db push` locally to create tables

## 📧 Email Setup

1. Enable 2FA on your Gmail account
2. Generate an App Password
3. Add to `.env`:
```env
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- SQL injection protection (Prisma)
- Environment variable protection
- CORS handled by Next.js

## 📝 API Endpoints

All endpoints are in `src/app/api/`:

- `POST /api/token` - Login
- `GET /api/stats` - Analytics
- `GET/PUT /api/profile` - Profile
- `GET/POST /api/projects` - Projects
- `GET/POST /api/services` - Services
- `POST /api/contact` - Contact form
- `GET /api/messages` - Messages (admin)
- And more...

## 🛠️ Development

### View Database
```bash
npx prisma studio
```

### Reset Database
```bash
rm dev.db
npx prisma db push
npx tsx prisma/seed.ts
```

### Add New Model
1. Update `prisma/schema.prisma`
2. Run `npx prisma db push`
3. Create API routes in `src/app/api/`

## 📚 Documentation

- [Migration Guide](MIGRATION_COMPLETE.md) - Full migration details
- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Deployment instructions

## 🤝 Contributing

This is a personal portfolio project, but feel free to fork and customize for your own use!

## 📄 License

MIT License - feel free to use this for your own portfolio.

---

**Built with ❤️ using Next.js**
