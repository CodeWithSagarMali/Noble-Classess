# Premium Coaching Management System (Noble Classes)

A state-of-the-art SaaS-style Coaching Management System built using a TypeScript + Express backend and a React + Vite + TypeScript + Tailwind CSS frontend. Supports role-based access control, online admissions, Razorpay payments, attendance tracking via Excel upload, online MCQ examinations with negative marking, support tickets, and comprehensive administrative dashboards.

## Features

- **Auth & Guard Rails**: Secure JWT (Access/Refresh Tokens) authentication with cookie storage, email verification, password reset workflows, and role-based route protection.
- **Online Admissions**: Multi-step student registration, document uploading (Aadhaar, marksheet, photo), automatic PDF receipt/form generation, and Razorpay-integrated registration fee payment.
- **Academic Management**: Administrative panels to manage courses, batches, and teachers. Excel sheet parser for attendance uploads.
- **Online Examination Panel**: Complete MCQ portal for students with countdown timers, auto-grading (with negative marking support), student scorecards, and batch leaderboards.
- **Administrative Panels**: Recharts analytics dashboard, system audit logs, CMS controls (Blogs, Gallery, Testimonials), and support ticket helpdesk.
- **Local Fallback Modes**: Fully functional out-of-the-box local fallback for AWS S3 (uses local `./uploads` directory) and Razorpay payments (uses instant mock validation in development mode).

---

## Technical Stack

- **Backend**: Node.js, Express.js, TypeScript, Prisma ORM, SQLite (local testing) / PostgreSQL (production), JWT, Multer, PDFKit, XLSX, Razorpay SDK.
- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Lucide icons, Framer Motion, Axios, React Query (TanStack), Recharts.
- **Containerization**: Docker, Docker-compose (multi-container orchestration).

---

## Directory Structure

```
noble_classes/
├── backend/                  # TypeScript Express Backend
│   ├── prisma/               # Prisma Database Schema & Seeds
│   ├── src/                  # App controllers, routes, and services
│   ├── Dockerfile
│   └── .env
├── frontend/                 # React Vite Frontend
│   ├── src/                  # Views, Pages, Context, Components
│   ├── Dockerfile
│   └── tailwind.config.js
├── docker-compose.yml        # Docker Compose configuration
└── task.md                   # Development Task Checklist
```

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm (v10+)

### Running Locally (Without Docker)

#### 1. Setup Backend Database & Server

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the SQLite database and run migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Seed the database with sample admin, teacher, student, courses, and exams:
   ```bash
   npm run db:seed
   ```
5. Start the backend developer server:
   ```bash
   npm run dev
   ```
   The backend API will run on `http://localhost:5000`.

#### 2. Setup Frontend Server

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies (using legacy peer deps for React 19 compatibility):
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

---

## Running with Docker Compose

1. In the root directory, run:
   ```bash
   docker-compose up --build
   ```
2. Access the frontend app at `http://localhost`.

---

## Seed Accounts (For Testing)

| Role    | Email                  | Password     | Description |
| ------- | ---------------------- | ------------ | ----------- |
| Admin   | `admin@nobleclasses.com` | `admin123`   | Complete access to courses, batches, logs, admissions, and settings. |
| Teacher | `teacher@nobleclasses.com`| `teacher123` | Uploads attendance via Excel, constructor MCQ exams, and uploads notes. |
| Student | `student@nobleclasses.com`| `student123` | Views attendance graphs, takes online MCQ exams, and opens support tickets. |

---

## Verification & Testing

### 1. Admin Verification
- Log in to the Admin Dashboard.
- Navigate to the **Academic** tab and verify stats.
- Create a new course and batch.

### 2. Teacher Verification
- Log in to the Teacher Dashboard.
- Download the attendance Excel template.
- Make edits and upload the template to automatically log batch attendance.

### 3. Student Verification
- Sign up as a new student.
- Navigate to the **Admission Portal**, fill in personal credentials, upload mock photo/aadhaar/marksheet files, and complete the registration.
- Log in as the student, navigate to the **Exams** tab, take the sample Kinematics physics exam, submit answers, and verify scores & leaderboard details.
