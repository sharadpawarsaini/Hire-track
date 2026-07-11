'use server';

import { db } from './db';
import { getCurrentUser } from './auth';
import { revalidatePath } from 'next/cache';
import { JobStatus, ApplicationStage } from '@prisma/client';

export async function createJobAction(state: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized.' };

  const title = formData.get('title') as string;
  const department = formData.get('department') as string;
  const location = formData.get('location') as string;
  const status = formData.get('status') as JobStatus;
  const cutoffRequirements = formData.get('cutoffRequirements') as string;

  if (!title || !department || !location || !status) {
    return { error: 'Please fill in all required fields.' };
  }

  try {
    const job = await db.job.create({
      data: {
        title,
        department,
        location,
        status,
        cutoffRequirements,
        orgId: user.orgId,
        createdBy: user.userId,
      },
    });

    // Log Activity
    await db.activityLog.create({
      data: {
        orgId: user.orgId,
        actorId: user.userId,
        entityType: 'Job',
        entityId: job.id,
        action: 'created',
        diffMetadata: JSON.stringify({ title, department, location, status }),
      },
    });

    revalidatePath('/jobs');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error('Create job error:', err);
    return { error: 'Failed to create job. Please try again.' };
  }
}

export async function createCandidateAction(state: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized.' };

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const source = formData.get('source') as string;
  const jobId = formData.get('jobId') as string;

  if (!name || !email || !jobId) {
    return { error: 'Please fill in all required fields.' };
  }

  try {
    // 1. Create candidate
    const candidate = await db.candidate.create({
      data: {
        name,
        email,
        phone,
        source,
        orgId: user.orgId,
      },
    });

    // 2. Create application
    const application = await db.application.create({
      data: {
        candidateId: candidate.id,
        jobId,
        stage: 'APPLIED',
        stageOrder: 0,
      },
      include: {
        job: true,
      },
    });

    // Log Activity
    await db.activityLog.create({
      data: {
        orgId: user.orgId,
        actorId: user.userId,
        entityType: 'Application',
        entityId: application.id,
        action: 'created',
        diffMetadata: JSON.stringify({ candidateName: name, jobTitle: application.job.title }),
      },
    });

    revalidatePath('/candidates');
    revalidatePath('/pipeline');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error('Create candidate error:', err);
    return { error: 'Failed to add candidate. Please try again.' };
  }
}

export async function updateApplicationStageAction(applicationId: string, newStage: ApplicationStage) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized.' };

  try {
    // Find application and ensure it belongs to the user's organization
    const app = await db.application.findFirst({
      where: {
        id: applicationId,
        job: { orgId: user.orgId },
      },
      include: {
        candidate: true,
      },
    });

    if (!app) return { error: 'Application not found.' };

    const oldStage = app.stage;

    await db.application.update({
      where: { id: applicationId },
      data: { stage: newStage },
    });

    // Log Activity
    await db.activityLog.create({
      data: {
        orgId: user.orgId,
        actorId: user.userId,
        entityType: 'Application',
        entityId: applicationId,
        action: 'stage_changed',
        diffMetadata: JSON.stringify({
          candidateName: app.candidate.name,
          from: oldStage,
          to: newStage,
        }),
      },
    });

    revalidatePath('/pipeline');
    revalidatePath('/candidates');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error('Update application stage error:', err);
    return { error: 'Failed to update stage.' };
  }
}
