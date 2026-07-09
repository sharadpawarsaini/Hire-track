# Milestone 3 Plan: Database Schema, Migrations, and Seed Data

This document specifies the technical design, data shapes, and verification plan for establishing the database layer of HireTrack.

---

## 1. User Stories
- **As a Developer/System**, I want a stable, well-indexed, and structured relational database schema that enforces integrity at the database level.
- **As a Developer**, I want standard seed data populated on migration so that I can immediately start testing the app with a zero-friction demo user and realistic pre-populated data.
- **As a Recruiting Team**, I want my deleted jobs and candidates to be soft-deleted so that I do not lose historical reporting metrics.

---

## 2. Acceptance Criteria
1. **Database Technology**: PostgreSQL managed via Prisma ORM.
2. **Entity Definitions**: Correctly define models for `Organization`, `User`, `Session`, `Job`, `Candidate`, `Application`, `Scorecard`, `Interview`, and `ActivityLog` in `schema.prisma`.
3. **IDs and Timestamps**: Every table must use server-generated CUIDs (or UUIDs) and auto-handled `created_at` / `updated_at` fields.
4. **Relational Cascade Rules**:
   - Deleting an `Organization` cascades to delete `User`, `Job`, `Candidate`, `ActivityLog`.
   - Deleting an `Application` cascades to delete `Scorecard` and `Interview`.
   - Deleting a `User` (interviewer) must *not* break scorecards or interviews; instead, it should block deletion or handle it via a set-null/nullification strategy, or we implement soft-deletion.
5. **Soft Delete Support**: `Job` and `Candidate` must feature a nullable `deleted_at` timestamp.
6. **Migrations**: Create and verify reproducible SQL migration files committed to Git.
7. **Seed Script**: Populate the database with:
   - 1 Demo Organization.
   - 4 Users with different roles (`owner`, `admin`, `member`, `viewer`). Include the zero-friction demo login user (`demo@demo.com` with password hashed using `bcrypt` cost $\ge 12$).
   - 3 Jobs (Draft, Open, Closed).
   - 5 Candidates with varying statuses and resumes.
   - 5 Applications mapped to stages.
   - 3 Scorecards and 2 Interviews.
   - Initial ActivityLogs.

---

## 3. Data Shapes (Prisma Schema Draft)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  OWNER
  ADMIN
  MEMBER
  VIEWER
}

enum JobStatus {
  DRAFT
  OPEN
  CLOSED
}

enum ApplicationStage {
  APPLIED
  SCREEN
  INTERVIEW
  OFFER
  HIRED
  REJECTED
}

enum Recommendation {
  STRONG_HIRE
  HIRE
  NO_HIRE
  STRONG_NO_HIRE
}

enum InterviewStatus {
  SCHEDULED
  COMPLETED
  CANCELLED
}

model Organization {
  id          String        @id @default(cuid())
  name        String
  slug        String        @unique
  createdAt   DateTime      @default(now()) @map("created_at")
  users       User[]
  jobs        Job[]
  candidates  Candidate[]
  activityLogs ActivityLog[]

  @@map("organizations")
}

model User {
  id              String        @id @default(cuid())
  orgId           String        @map("org_id")
  email           String        @unique
  passwordHash    String        @map("password_hash")
  name            String
  role            Role          @default(MEMBER)
  emailVerifiedAt DateTime?     @map("email_verified_at")
  createdAt       DateTime      @default(now()) @map("created_at")
  updatedAt       DateTime      @updatedAt @map("updated_at")
  organization    Organization  @relation(fields: [orgId], references: [id], onDelete: Cascade)
  sessions        Session[]
  scorecards      Scorecard[]

  @@map("users")
}

model Session {
  id        String   @id @default(cuid())
  userId    String   @map("user_id")
  token     String   @unique
  expiresAt DateTime @map("expires_at")
  createdAt DateTime @default(now()) @map("created_at")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model Job {
  id                 String        @id @default(cuid())
  orgId              String        @map("org_id")
  title              String
  department         String
  location           String
  status             JobStatus     @default(DRAFT)
  cutoffRequirements String?       @map("cutoff_requirements") @db.Text
  createdBy          String        @map("created_by")
  createdAt          DateTime      @default(now()) @map("created_at")
  updatedAt          DateTime      @updatedAt @map("updated_at")
  deletedAt          DateTime?     @map("deleted_at")
  organization       Organization  @relation(fields: [orgId], references: [id], onDelete: Cascade)
  applications       Application[]

  @@map("jobs")
}

model Candidate {
  id           String        @id @default(cuid())
  orgId        String        @map("org_id")
  name         String
  email        String
  phone        String?
  resumeUrl    String?       @map("resume_url")
  source       String?
  createdAt    DateTime      @default(now()) @map("created_at")
  updatedAt    DateTime      @updatedAt @map("updated_at")
  deletedAt    DateTime?     @map("deleted_at")
  organization Organization  @relation(fields: [orgId], references: [id], onDelete: Cascade)
  applications Application[]

  @@map("candidates")
}

model Application {
  id          String           @id @default(cuid())
  candidateId String           @map("candidate_id")
  jobId       String           @map("job_id")
  stage       ApplicationStage @default(APPLIED)
  stageOrder  Int              @default(0) @map("stage_order")
  createdAt   DateTime         @default(now()) @map("created_at")
  updatedAt   DateTime         @updatedAt @map("updated_at")
  candidate   Candidate        @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  job         Job              @relation(fields: [jobId], references: [id], onDelete: Cascade)
  scorecards  Scorecard[]
  interviews  Interview[]

  @@unique([candidateId, jobId])
  @@map("applications")
}

model Scorecard {
  id             String         @id @default(cuid())
  applicationId  String         @map("application_id")
  interviewerId  String         @map("interviewer_id")
  rating         Int            // 1 to 5
  strengths      String?        @db.Text
  concerns       String?        @db.Text
  recommendation Recommendation
  createdAt      DateTime       @default(now()) @map("created_at")
  application    Application    @relation(fields: [applicationId], references: [id], onDelete: Cascade)
  interviewer    User           @relation(fields: [interviewerId], references: [id], onDelete: Restrict)

  @@map("scorecards")
}

model Interview {
  id             String          @id @default(cuid())
  applicationId  String          @map("application_id")
  scheduledAt    DateTime        @map("scheduled_at")
  durationMinutes Int            @map("duration_minutes")
  interviewerIds String          @map("interviewer_ids") // JSON array of User IDs
  status         InterviewStatus @default(SCHEDULED)
  locationLink   String?         @map("location_link")
  createdAt      DateTime        @default(now()) @map("created_at")
  application    Application     @relation(fields: [applicationId], references: [id], onDelete: Cascade)

  @@map("interviews")
}

model ActivityLog {
  id           String       @id @default(cuid())
  orgId        String       @map("org_id")
  actorId      String       @map("actor_id")
  entityType   String       @map("entity_type")
  entityId     String       @map("entity_id")
  action       String
  diffMetadata String?      @map("diff_metadata") @db.Text // JSON string
  createdAt    DateTime     @default(now()) @map("created_at")
  organization Organization @relation(fields: [orgId], references: [id], onDelete: Cascade)

  @@map("activity_logs")
}
```

---

## 4. Affected Files
- [NEW] `prisma/schema.prisma`
- [NEW] `prisma/seed.ts`
- [MODIFY] `package.json` (to include Prisma CLI helper scripts)

---

## 5. Edge Cases
- **Soft Delete vs Cascade**: Deleting an Organization must cascade and physically delete all related records, even if they have `deleted_at` set. This is handled by database-level cascade deletes.
- **Interviewer Deletion**: A user who has written scorecards or interviews cannot be deleted directly due to `onDelete: Restrict` on the `Scorecard` relation. This preserves historical scorecard authenticity.
- **Duplicate Applications**: An `@@unique([candidateId, jobId])` constraint prevents a candidate from submitting multiple applications to the exact same job post.
