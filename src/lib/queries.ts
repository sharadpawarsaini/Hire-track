import { db } from './db';
import { getCurrentUser } from './auth';

// ─── Dashboard ──────────────────────────────────────────────────────────────
export async function getDashboardStats() {
  const user = await getCurrentUser();
  if (!user) {
    return {
      totalJobs: 0,
      openJobs: 0,
      totalCandidates: 0,
      totalApplications: 0,
      recentActivity: [],
      stageBreakdown: [],
    };
  }

  const orgId = user.orgId;

  const [totalJobs, openJobs, totalCandidates, totalApplications, recentActivity] =
    await Promise.all([
      db.job.count({ where: { orgId, deletedAt: null } }),
      db.job.count({ where: { orgId, status: 'OPEN', deletedAt: null } }),
      db.candidate.count({ where: { orgId, deletedAt: null } }),
      db.application.count({ where: { candidate: { orgId } } }),
      db.activityLog.findMany({
        where: { orgId },
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: { organization: { select: { name: true } } },
      }),
    ]);

  const stageBreakdown = await db.application.groupBy({
    where: { candidate: { orgId } },
    by: ['stage'],
    _count: true,
  });

  return { totalJobs, openJobs, totalCandidates, totalApplications, recentActivity, stageBreakdown };
}

// ─── Jobs ───────────────────────────────────────────────────────────────────
export async function getJobs() {
  const user = await getCurrentUser();
  if (!user) return [];

  return db.job.findMany({
    where: { orgId: user.orgId, deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { applications: true } },
    },
  });
}

export async function getJobById(id: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  return db.job.findFirst({
    where: { id, orgId: user.orgId },
    include: {
      applications: {
        include: {
          candidate: true,
          scorecards: { include: { interviewer: { select: { name: true } } } },
          interviews: true,
        },
        orderBy: { updatedAt: 'desc' },
      },
    },
  });
}

// ─── Candidates ──────────────────────────────────────────────────────────────
export async function getCandidates() {
  const user = await getCurrentUser();
  if (!user) return [];

  return db.candidate.findMany({
    where: { orgId: user.orgId, deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { applications: true } },
      applications: {
        where: { job: { orgId: user.orgId } },
        select: { stage: true, job: { select: { title: true } } },
        orderBy: { updatedAt: 'desc' },
        take: 1,
      },
    },
  });
}

// ─── Pipeline ────────────────────────────────────────────────────────────────
export async function getPipelineData() {
  const user = await getCurrentUser();
  if (!user) {
    return {
      APPLIED: [],
      SCREEN: [],
      INTERVIEW: [],
      OFFER: [],
      HIRED: [],
      REJECTED: [],
    };
  }

  const applications = await db.application.findMany({
    where: { job: { orgId: user.orgId } },
    orderBy: [{ stage: 'asc' }, { updatedAt: 'desc' }],
    include: {
      candidate: true,
      job: { select: { title: true, department: true } },
      _count: { select: { scorecards: true } },
    },
  });

  const stages = ['APPLIED', 'SCREEN', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'] as const;
  const grouped = Object.fromEntries(
    stages.map((s) => [s, applications.filter((a) => a.stage === s)]),
  );
  return grouped;
}

// ─── Interviews ───────────────────────────────────────────────────────────────
export async function getInterviews() {
  const user = await getCurrentUser();
  if (!user) return [];

  return db.interview.findMany({
    where: { application: { job: { orgId: user.orgId } } },
    orderBy: { scheduledAt: 'asc' },
    include: {
      application: {
        include: {
          candidate: { select: { name: true, email: true } },
          job: { select: { title: true } },
        },
      },
    },
  });
}

// ─── Activity ─────────────────────────────────────────────────────────────────
export async function getActivityLogs() {
  const user = await getCurrentUser();
  if (!user) return [];

  return db.activityLog.findMany({
    where: { orgId: user.orgId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}
