# <p align="center"><img src="/public/images/logo.png" alt="HireTrack Logo" width="120" /><br>HireTrack</p>

> A premium, ultra-modern, dark-themed Applicant Tracking System (ATS) built with Next.js 16, TypeScript, Tailwind CSS, Prisma 7, and Supabase PostgreSQL. Features tenant-isolated authentication, real-time pipeline visualisations, and compliance-ready audit trails.

<p align="center">
  <img src="/public/images/dashboard_mockup.png" alt="HireTrack Portal Dashboard Mockup" width="100%" style="border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);" />
</p>

---

## 🌟 Key Features

*   **🔒 Edge-Secured Authentication**: Lightweight stateless JWT session store signed via Web Crypto APIs (`crypto.subtle`), guarded by Next.js Edge Middleware for redirect security.
*   **🏢 Multi-Tenant Isolation**: Data queries and mutators are partitioned at the database layer based on the authenticated user's `orgId`.
*   **📊 Scoped Analytics Dashboard**: At-a-glance cards showing open jobs, applicant ratios, active pipelines, and a live compliance audit log.
*   **⚡ Interactive Job & Sourcing Portals**: Beautiful form dialogs linked directly to Server Actions to post requisitions and register applicants.
*   **📋 Kanban Pipeline Board**: Stage-mover interface allowing teams to move applicants between stages dynamically (Applied, Screen, Interview, Offer, Hired, Rejected).
*   **📅 Interview Tracker**: Scheduled schedules with zoom links, durations, and detailed post-call scorecards.
*   **📜 Compliance Audit Trail**: Immutable log recording detailed action metadata and stage-change transitions.

---

## ⚙️ Technology Stack

| Component | Technology | Description |
|---|---|---|
| **Core Framework** | **Next.js 16** (App Router) | React Server Components, Server Actions & Edge Middleware |
| **Styling** | **Tailwind CSS & CSS HSL Variables** | Premium dark-theme variables with smooth transitions |
| **Database ORM** | **Prisma 7** | Modern PostgreSQL integration utilizing runtime driver adapters |
| **Database Pool** | **Supabase PostgreSQL & `@prisma/adapter-pg`** | Secure, hosted Postgres database connection layer |
| **Auth Cryptography** | **Web Crypto API & `bcryptjs`** | Stateless JWT signature verification and secure hashing |

---

## 🔄 Step-by-Step Portal Workflows

### Workflow 1: Registration & Tenant Separation
```
[Visitor] ───► Visits Signup ───► Creates Org & Account ───► Auto-login JWT Cookie set
                                                                  │
[Secure Dashboard] ◄─── Scopes all queries by orgId ◄─────────────┘
```
1.  A new user signs up on `/signup` by entering their Name, Email, Password, and Company Name.
2.  The backend hashes the password, inserts a new `Organization`, and creates the user as the `OWNER`.
3.  A stateless JWT is signed via Web Crypto and saved as an HTTP-only secure cookie (`session_token`).
4.  All future queries are scoped automatically (`where: { orgId: user.orgId }`), providing complete data isolation.

---

### Workflow 2: Requisition & Sourcing
1.  An Owner/Admin navigates to the **Jobs** tab and clicks **New Job**.
2.  They submit the requisition form (Title, Department, Location, Status, Requirements).
3.  The job is inserted into the DB, and an audit trail log is created.
4.  When adding candidates via the **Candidates** tab, the system displays a dropdown of available job requisitions to link them to an active application.

---

### Workflow 3: Candidate Stage Transitions
1.  The recruitment team accesses the **Pipeline** board (Kanban view).
2.  Each candidate card features a stage selector.
3.  Selecting a new stage fires a Server Action which:
    *   Updates the application stage.
    *   Logs the stage transition (e.g. `SCREEN` ──► `INTERVIEW`).
    *   Triggers Next.js `revalidatePath` to refresh all client views instantly.

---

## 🚀 Getting Started

### 1. Configure Environments
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres"
JWT_SECRET="a-very-long-and-secure-random-secret-key-that-is-at-least-32-chars"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Deploy Database Schema & Seed
```bash
npx prisma db push
npm.cmd run db:seed
```
*Note: Seed script populates a default test organization (`Acme Corp`) with a demo user:*
*   **Email**: `demo@demo.com`
*   **Password**: `demo1234`

### 4. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧪 Testing and Validation

```bash
npm.cmd run typecheck  # Strict TypeScript compilation check
npm run test           # Run Unit tests (Vitest)
npm run test:e2e       # Run End-to-End tests (Playwright)
npm run build          # Create production build bundle
```

---

## 🔒 License & Copyright

© 2026 Shatrad Pawarsaini. All rights reserved. Created as a premium, real-life ATS recruiting portal.
