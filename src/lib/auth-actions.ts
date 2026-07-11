'use server';

import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { db } from './db';
import { signJWT } from './auth';

export async function loginAction(state: any, formData: FormData) {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Please enter all fields.' };
  }

  try {
    const user = await db.user.findUnique({
      where: { email },
      include: { organization: true },
    });

    if (!user) {
      return { error: 'Invalid email or password.' };
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return { error: 'Invalid email or password.' };
    }

    const token = await signJWT({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      orgId: user.orgId,
    });

    const cookieStore = await cookies();
    cookieStore.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true };
  } catch (err: any) {
    console.error('Login error:', err);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}

export async function signupAction(state: any, formData: FormData) {
  const name = (formData.get('name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;
  const companyName = (formData.get('companyName') as string)?.trim();

  if (!name || !email || !password || !companyName) {
    return { error: 'Please fill in all fields.' };
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' };
  }

  try {
    // Check if email already exists
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: 'An account with this email already exists.' };
    }

    // Generate a unique slug for the organization
    const baseSlug = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'org';

    // Ensure slug uniqueness by appending a short random suffix if needed
    let orgSlug = baseSlug;
    const existingOrg = await db.organization.findUnique({ where: { slug: orgSlug } });
    if (existingOrg) {
      // Append random 6-char suffix to make it unique
      orgSlug = `${baseSlug}-${Math.random().toString(36).slice(2, 8)}`;
    }

    // Create organization
    const org = await db.organization.create({
      data: {
        name: companyName,
        slug: orgSlug,
      },
    });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        orgId: org.id,
        role: 'OWNER',
      },
    });

    const token = await signJWT({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      orgId: user.orgId,
    });

    const cookieStore = await cookies();
    cookieStore.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true };
  } catch (err: any) {
    console.error('Signup error details:', {
      message: err.message,
      code: err.code,
      meta: err.meta,
    });
    // Provide specific error for common Prisma constraint violations
    if (err.code === 'P2002') {
      const field = err.meta?.target?.[0];
      if (field === 'email') return { error: 'An account with this email already exists.' };
      if (field === 'slug') return { error: 'Organization name already taken. Please try a different name.' };
    }
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('session_token');
  return { success: true };
}
