'use server';

import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { db } from './db';
import { signJWT } from './auth';

export async function loginAction(state: any, formData: FormData) {
  const email = formData.get('email') as string;
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
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const companyName = formData.get('companyName') as string;

  if (!name || !email || !password || !companyName) {
    return { error: 'Please enter all fields.' };
  }

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: 'Email already registered.' };
    }

    // Create organization
    const orgSlug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const org = await db.organization.create({
      data: {
        name: companyName,
        slug: orgSlug || `org-${Date.now()}`,
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
    console.error('Signup error:', err);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('session_token');
  return { success: true };
}
