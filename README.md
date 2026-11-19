# PLUMP

Planning & Logistics for Unified Management of Projects was a group software engineering project. The repository includes the course submissions, interface prototypes, a React project-management UI and a NestJS service.

| Component | Location |
| --- | --- |
| NestJS service and Prisma schema | [plump](plump/) |
| React and Vite interface | [project-management-ui](project-management-ui/) |
| Interface prototypes | [Frontend](Frontend/) |
| Requirements and submissions | [Requirements](Requirements/) and [Submissions](Submissions/) |

To start the backend on port 3000, run `npm ci` and `npm run start:dev` inside `plump/`. The root route is a startup check. Project-management screens and the data schema represent additional project work, beyond that route.
<p align="center">
  <img src="Assets/Logo.jpeg" width="250">
</p>

# PLUMP  

**Planning & Logistics for Unified Management of Projects**

## Features 💡  
✅ Task Tracking 📅  
✅ Team Collaboration 🤝  
✅ Productivity Insights 📊  

### Overview

PLUMP is a comprehensive project management platform designed to streamline task tracking, team collaboration, and productivity insights. Built with a modern tech stack (NestJS, React, Docker), it supports both frontend and backend modularity, and is suitable for teams seeking a unified solution for project logistics. The purpose of PLUMP is to provide a centralized tool for planning, organizing, and managing projects efficiently, ensuring that teams can collaborate seamlessly and track progress in real-time.

### Tech Stack

- **Frontend**: React (Vite, Tailwind CSS, Framer Motion, Recharts)
- **Backend**: NestJS (TypeScript), Prisma ORM, SQLite
- **Containerization**: Docker & Docker Compose
- **Other**: GitHub Issues for task management, WhatsApp for quick comms

### Repository Structure

```
/
├── Backend/                # Backend documentation and specs
├── Frontend/               # Frontend documentation and specs
├── plump/                  # Main backend NestJS app
├── project-management-ui/  # Main frontend React app
├── date-detail/, task/     # Feature modules (backend)
├── Requirements/           # Requirements and process docs
├── Submissions/            # Submission packages and diagrams
├── Docs/                   # Meeting notes and documentation
├── Assets/                 # Images and logos
├── Docker-compose.yml      # Multi-service orchestration
└── Group Detailing.txt     # Team member breakdown
```

### Quick Start

#### Prerequisites

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/) (for local dev)

#### One-Command Setup (Recommended)

```bash
docker-compose up --build
```

- Frontend: [http://localhost:8080](http://localhost:8080)
- Backend API: [http://localhost:3000](http://localhost:3000)

#### Manual Setup

**Backend**
```bash
cd plump
npm install
npm run start:dev
```

**Frontend**
```bash
cd project-management-ui
npm install
npm run dev
```

### Team

- **Frontend**: Bissera, Stefan, Milica, Saim
- **Backend**: Kuranage, Felipe, Bilal, Kamila, Madina, Melek

### Documentation

- **Requirements**: See `/Requirements` and `/Submissions/S25_SE_23_PLUMP_Submission1`
- **API Docs**: See `/Submissions/S25_SE_23_PLUMP_Submission1/API_documentation.pdf`
- **ER Diagram**: `/Submissions/S25_SE_23_PLUMP_Submission1/PLUMP_ER_Diagram_Structured.png`
- **Meetings**: `/Docs/Meetings/`
- **Productivity Scheme**: See Backend/Frontend folders

### License

This project is licensed under the GNU General Public License v3.0. See the LICENSE file for details.
