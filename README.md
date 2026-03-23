<!--
Suggested GitHub Topics: nestjs react typescript prisma docker project-management tailwind fullstack
-->

<p align="center">
  <img src="Assets/Logo.jpeg" width="250">
</p>

# PLUMP — Project Management Platform

**Planning & Logistics for Unified Management of Projects**

PLUMP is a full-stack project management platform for task tracking, team collaboration, and productivity insights. It features a React frontend with real-time dashboards and a NestJS REST API backed by Prisma ORM / SQLite.

## Features

- **Task Management** — Create, assign, and track tasks with due dates and priority levels
- **Team Collaboration** — Manage team members, roles, and unit assignments
- **Project Dashboards** — Real-time productivity charts and progress tracking via Recharts
- **Budget & Risk Tracking** — Dedicated views for budget management and risk assessment
- **Calendar View** — Visual timeline of project milestones and deadlines
- **Authentication** — JWT-based auth with login, signup, and password recovery
- **Organisation Management** — Multi-org support with role-based access

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Vite, Tailwind CSS, Framer Motion, Recharts |
| Backend | NestJS, TypeScript, Prisma ORM, SQLite |
| Infrastructure | Docker, Docker Compose |

## Architecture

```
PLUMP/
├── project-management-ui/   # React/Vite frontend (port 8080)
│   ├── src/
│   │   ├── pages/           # Route-level page components
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Auth & user context providers
│   │   └── utils/           # API fetch helpers
│   └── Dockerfile
├── plump/                   # NestJS backend (port 3000)
│   ├── src/
│   │   ├── auth/            # JWT authentication
│   │   ├── organization/    # Organisation management
│   │   ├── unit/            # Unit/team management
│   │   ├── team-membership/ # Member role assignments
│   │   └── plump/           # Core plump service
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── Dockerfile
└── Docker-compose.yml       # Multi-service orchestration
```

## Quick Start

### One-command setup (recommended)

```bash
git clone <repo-url>
cd PLUMP
docker-compose up --build
```

- Frontend: [http://localhost:8080](http://localhost:8080)
- Backend API: [http://localhost:3000](http://localhost:3000)

### Manual setup

**Backend**
```bash
cd plump
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

**Frontend**
```bash
cd project-management-ui
npm install
npm run dev
```

## CI/CD

GitHub Actions workflows are configured in `.github/workflows/`:
- `ci.yml` — runs backend and frontend build + tests on every push and PR to `main`
- `deploy-pages.yml` — builds and deploys the frontend to GitHub Pages on every push to `main`

## GitHub Pages Demo

The live GitHub Pages deployment runs in **demo mode** (`VITE_DEMO_MODE=true`). In this mode the frontend is a fully self-contained static site — no backend is required. All API calls are intercepted at build time and resolved against bundled mock data (projects, tasks, budgets, calendar events, time logs, risks, and users).

> Any email and password will work on the login page. Data changes (adding tasks, editing projects, etc.) persist only for the current browser session and reset on page refresh.

To deploy the full live application with a real database, host the NestJS backend separately (e.g. Render, Railway) and set the `VITE_API_URL` repository secret to point at it — then remove `VITE_DEMO_MODE: 'true'` from `deploy-pages.yml`.

## License

GNU General Public License v3.0 — see [LICENSE](LICENSE) for details.
