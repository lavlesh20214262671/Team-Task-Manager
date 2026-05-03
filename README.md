# Team Task Manager

A full-stack web application for managing team tasks, projects, and collaboration.

## Features

- **Authentication** – Signup/login with JWT tokens, secure cookie-based refresh
- **Projects** – Create projects, invite members, track progress
- **Tasks** – Create, assign, update tasks with status/priority/due date
- **Dashboard** – Real-time stats, task overview chart, upcoming tasks
- **Calendar** – Monthly calendar with task events
- **Members** – Team member management
- **Profile & Settings** – User profile, password, preferences

## Tech Stack

**Frontend:** React 19, TypeScript, Vite, React Router v7, CSS (no UI library)  
**Backend:** Node.js, Express 5, Prisma ORM, PostgreSQL, JWT, Socket.io

## Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env   # Fill in your DATABASE_URL and JWT secrets
npx prisma migrate deploy
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env   # Set VITE_API_URL to your backend URL
npm run dev
```

## Deployment (Railway)

1. Create two services on Railway: one for backend, one for frontend  
2. Set environment variables in Railway dashboard  
3. Backend: `npm run build && npm start`  
4. Frontend: `npm run build` → serve `dist/` via nginx (see `nginx.conf`)

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/v1/auth/signup | Register |
| POST | /api/v1/auth/login | Login |
| GET | /api/v1/auth/me | Current user |
| GET | /api/v1/projects | List projects |
| POST | /api/v1/projects | Create project |
| POST | /api/v1/projects/:id/members | Add member |
| GET | /api/v1/projects/:id/tasks | List tasks |
| POST | /api/v1/projects/:id/tasks | Create task |
| PATCH | /api/v1/projects/:id/tasks/:taskId | Update task |
| GET | /api/v1/dashboard/:projectId/stats | Dashboard stats |
| GET | /api/v1/users | List users |
