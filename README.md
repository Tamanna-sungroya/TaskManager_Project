# Task Forge (Production MVP)

Task Forge is a MERN AI-powered productivity platform with:
- JWT auth + role-based access
- OTP email verification (register + login)
- Google OAuth backend flow
- Admin/user dashboards
- User task Kanban (`@dnd-kit`)
- Assignment + reminder email system
- Forge AI productivity assistant

## Updated Structure

- `backend/` Express API, Mongo models, controllers, routes, services
- `frontend/Task-Manager/` React app (dashboard UI + task workflow + Kanban + assistant)
- `.env.example` production env template

## Run Locally

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

### 2) Frontend

```bash
cd frontend/Task-Manager
npm install
npm run dev
```

## Core API Endpoints

- Auth
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/google`
  - `POST /api/auth/register/otp/send`
  - `POST /api/auth/register/otp/verify`
  - `POST /api/auth/login/otp/send`
  - `POST /api/auth/login/otp/verify`
- Users (admin)
  - `GET /api/users`
  - `POST /api/users`
  - `PUT /api/users/:id`
  - `DELETE /api/users/:id` (soft delete)
- Tasks
  - `GET /api/tasks`
  - `POST /api/tasks`
  - `PUT /api/tasks/:id`
  - `DELETE /api/tasks/:id` (soft delete)
  - `PUT /api/tasks/:id/status`
  - `PUT /api/tasks/:id/todo`
- AI
  - `POST /api/ai/ask`
  - `POST /api/ai/stream` (streaming text response)

## Deployment Notes

- Set all env vars from `.env.example`.
- Set both `GOOGLE_CLIENT_ID` (backend verify) and `VITE_GOOGLE_CLIENT_ID` (frontend GIS button).
- Use managed MongoDB Atlas.
- Configure production SMTP provider.
- Set `CLIENT_URL` to deployed frontend URL for CORS and links.
- Run backend as a long-lived process (PM2, Docker, or PaaS service).
- Reminder cron is internal to API process and persists via DB (`reminderSent` flag).

## Verification Checklist

- Register user with OTP verify then login.
- Login with password and OTP both.
- Admin can create/update/delete users and tasks.
- User task CRUD/status updates persist.
- Kanban drag updates status in DB.
- Assignment emails trigger on task create.
- 4-hour reminder emails trigger once (`reminderSent=true`).
- AI assistant returns personalized ranked advice.
