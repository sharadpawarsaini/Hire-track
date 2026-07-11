import { db } from './db';

// ─── Dashboard ──────────────────────────────────────────────────────────────
export async function getDashboardStats() {
  const [totalJobs, openJobs, totalCandidates, totalApplications, recentActivity] =
    await Promise.all([
      db.job.count({ where: { deletedAt: null } }),
      db.job.count({ where: { status: 'OPEN', deletedAt: null } }),
      db.candidate.count({ where: { deletedAt: null } }),
      db.application.count(),
      db.activityLog.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: { organization: { select: { name: true } } },
      }),
    ]);

  const stageBreakdown = await db.application.groupBy({
    by: ['stage'],
    _count: true,
  });

  return { totalJobs, openJobs, totalCandidates, totalApplications, recentActivity, stageBreakdown };
}

// ─── Jobs ───────────────────────────────────────────────────────────────────
export async function getJobs() {
  return db.job.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { applications: true } },
    },
  });
}

export async function getJobById(id: string) {
  return db.job.findUnique({
    where: { id },
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
  return db.candidate.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { applications: true } },
      applications: {
        select: { stage: true, job: { select: { title: true } } },
        orderBy: { updatedAt: 'desc' },
        take: 1,
      },
    },
  });
}

// ─── Pipeline ────────────────────────────────────────────────────────────────
export async function getPipelineData() {
  const applications = await db.application.findMany({
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
  return db.interview.findMany({
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
  return db.activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}
