import { PrismaClient, Role, JobStatus, ApplicationStage, Recommendation, InterviewStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Clean up existing data ────────────────────────────────────────────
  await prisma.activityLog.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.scorecard.deleteMany();
  await prisma.application.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.job.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  // ─── Organization ──────────────────────────────────────────────────────
  const org = await prisma.organization.create({
    data: {
      id: 'org_demo',
      name: 'Acme Corp',
      slug: 'acme-corp',
    },
  });
  console.log(`✅ Created org: ${org.name}`);

  // ─── Users ─────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('password123', 12);
  const demoHash = await bcrypt.hash('demo1234', 12);

  const [owner, admin, member, viewer] = await Promise.all([
    prisma.user.create({
      data: {
        id: 'user_owner',
        orgId: org.id,
        email: 'demo@demo.com',
        passwordHash: demoHash,
        name: 'Demo Owner',
        role: Role.OWNER,
        emailVerifiedAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        id: 'user_admin',
        orgId: org.id,
        email: 'priya.sharma@acme.com',
        passwordHash,
        name: 'Priya Sharma',
        role: Role.ADMIN,
        emailVerifiedAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        id: 'user_member',
        orgId: org.id,
        email: 'arjun.patel@acme.com',
        passwordHash,
        name: 'Arjun Patel',
        role: Role.MEMBER,
        emailVerifiedAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        id: 'user_viewer',
        orgId: org.id,
        email: 'meera.nair@acme.com',
        passwordHash,
        name: 'Meera Nair',
        role: Role.VIEWER,
        emailVerifiedAt: new Date(),
      },
    }),
  ]);
  console.log(`✅ Created 4 users`);

  // ─── Jobs ──────────────────────────────────────────────────────────────
  const [jobSeniorFE, jobBackend, jobPM] = await Promise.all([
    prisma.job.create({
      data: {
        id: 'job_sfe',
        orgId: org.id,
        title: 'Senior Frontend Engineer',
        department: 'Engineering',
        location: 'Remote — India',
        status: JobStatus.OPEN,
        cutoffRequirements: '5+ years React, TypeScript, system design experience.',
        createdBy: owner.id,
      },
    }),
    prisma.job.create({
      data: {
        id: 'job_be',
        orgId: org.id,
        title: 'Backend Engineer (Node.js)',
        department: 'Engineering',
        location: 'Bangalore, India',
        status: JobStatus.OPEN,
        cutoffRequirements: '3+ years Node.js, PostgreSQL, REST API design.',
        createdBy: admin.id,
      },
    }),
    prisma.job.create({
      data: {
        id: 'job_pm',
        orgId: org.id,
        title: 'Product Manager',
        department: 'Product',
        location: 'Mumbai, India',
        status: JobStatus.CLOSED,
        cutoffRequirements: '4+ years SaaS product management experience.',
        createdBy: owner.id,
      },
    }),
  ]);
  console.log(`✅ Created 3 jobs`);

  // ─── Candidates ────────────────────────────────────────────────────────
  const [c1, c2, c3, c4, c5] = await Promise.all([
    prisma.candidate.create({
      data: {
        id: 'cand_1',
        orgId: org.id,
        name: 'Riya Desai',
        email: 'riya.desai@gmail.com',
        phone: '+91 98201 11111',
        source: 'LinkedIn',
      },
    }),
    prisma.candidate.create({
      data: {
        id: 'cand_2',
        orgId: org.id,
        name: 'Vikram Mehta',
        email: 'vikram.m@outlook.com',
        phone: '+91 98201 22222',
        source: 'Naukri',
      },
    }),
    prisma.candidate.create({
      data: {
        id: 'cand_3',
        orgId: org.id,
        name: 'Ananya Singh',
        email: 'ananya.singh@proton.me',
        phone: '+91 98201 33333',
        source: 'Referral',
      },
    }),
    prisma.candidate.create({
      data: {
        id: 'cand_4',
        orgId: org.id,
        name: 'Karan Verma',
        email: 'karan.v@gmail.com',
        phone: '+91 98201 44444',
        source: 'LinkedIn',
      },
    }),
    prisma.candidate.create({
      data: {
        id: 'cand_5',
        orgId: org.id,
        name: 'Shreya Kulkarni',
        email: 'shreya.k@yahoo.com',
        phone: '+91 98201 55555',
        source: 'Direct',
      },
    }),
  ]);
  console.log(`✅ Created 5 candidates`);

  // ─── Applications ──────────────────────────────────────────────────────
  const [app1, app2, app3, app4, app5] = await Promise.all([
    prisma.application.create({
      data: {
        id: 'app_1',
        candidateId: c1.id,
        jobId: jobSeniorFE.id,
        stage: ApplicationStage.INTERVIEW,
        stageOrder: 2,
      },
    }),
    prisma.application.create({
      data: {
        id: 'app_2',
        candidateId: c2.id,
        jobId: jobSeniorFE.id,
        stage: ApplicationStage.SCREEN,
        stageOrder: 1,
      },
    }),
    prisma.application.create({
      data: {
        id: 'app_3',
        candidateId: c3.id,
        jobId: jobBackend.id,
        stage: ApplicationStage.OFFER,
        stageOrder: 3,
      },
    }),
    prisma.application.create({
      data: {
        id: 'app_4',
        candidateId: c4.id,
        jobId: jobBackend.id,
        stage: ApplicationStage.REJECTED,
        stageOrder: 1,
      },
    }),
    prisma.application.create({
      data: {
        id: 'app_5',
        candidateId: c5.id,
        jobId: jobPM.id,
        stage: ApplicationStage.HIRED,
        stageOrder: 5,
      },
    }),
  ]);
  console.log(`✅ Created 5 applications`);

  // ─── Scorecards ────────────────────────────────────────────────────────
  await Promise.all([
    prisma.scorecard.create({
      data: {
        applicationId: app1.id,
        interviewerId: member.id,
        rating: 4,
        strengths: 'Excellent React knowledge, great system design instincts.',
        concerns: 'Slightly weak on CSS architecture for large-scale apps.',
        recommendation: Recommendation.HIRE,
      },
    }),
    prisma.scorecard.create({
      data: {
        applicationId: app3.id,
        interviewerId: admin.id,
        rating: 5,
        strengths: 'Strong PostgreSQL skills, excellent API design, team player.',
        concerns: 'None significant.',
        recommendation: Recommendation.STRONG_HIRE,
      },
    }),
    prisma.scorecard.create({
      data: {
        applicationId: app4.id,
        interviewerId: member.id,
        rating: 2,
        strengths: 'Decent understanding of REST concepts.',
        concerns: 'Limited Node.js production experience, weak on databases.',
        recommendation: Recommendation.NO_HIRE,
      },
    }),
  ]);
  console.log(`✅ Created 3 scorecards`);

  // ─── Interviews ────────────────────────────────────────────────────────
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(14, 30, 0, 0);

  await Promise.all([
    prisma.interview.create({
      data: {
        applicationId: app1.id,
        scheduledAt: tomorrow,
        durationMinutes: 60,
        interviewerIds: JSON.stringify([member.id, admin.id]),
        status: InterviewStatus.SCHEDULED,
        locationLink: 'https://meet.google.com/abc-defg-hij',
      },
    }),
    prisma.interview.create({
      data: {
        applicationId: app3.id,
        scheduledAt: nextWeek,
        durationMinutes: 45,
        interviewerIds: JSON.stringify([admin.id]),
        status: InterviewStatus.COMPLETED,
        locationLink: 'https://zoom.us/j/1234567890',
      },
    }),
  ]);
  console.log(`✅ Created 2 interviews`);

  // ─── Activity Logs ─────────────────────────────────────────────────────
  await Promise.all([
    prisma.activityLog.create({
      data: {
        orgId: org.id,
        actorId: owner.id,
        entityType: 'Job',
        entityId: jobSeniorFE.id,
        action: 'created',
        diffMetadata: JSON.stringify({ status: 'OPEN', title: 'Senior Frontend Engineer' }),
      },
    }),
    prisma.activityLog.create({
      data: {
        orgId: org.id,
        actorId: admin.id,
        entityType: 'Application',
        entityId: app1.id,
        action: 'stage_changed',
        diffMetadata: JSON.stringify({ from: 'SCREEN', to: 'INTERVIEW' }),
      },
    }),
    prisma.activityLog.create({
      data: {
        orgId: org.id,
        actorId: admin.id,
        entityType: 'Application',
        entityId: app3.id,
        action: 'stage_changed',
        diffMetadata: JSON.stringify({ from: 'INTERVIEW', to: 'OFFER' }),
      },
    }),
  ]);
  console.log(`✅ Created 3 activity logs`);

  console.log('');
  console.log('🎉 Seed complete!');
  console.log('');
  console.log('  Demo login → email: demo@demo.com  |  password: demo1234');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
