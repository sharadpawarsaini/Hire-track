'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginAction } from '@/lib/auth-actions';

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.success) {
      router.push('/dashboard');
      router.refresh();
    }
  }, [state?.success, router]);

  const fillDemoCredentials = () => {
    if (emailRef.current && passwordRef.current) {
      emailRef.current.value = 'demo@demo.com';
      passwordRef.current.value = 'demo1234';
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
      <h1 className="text-3xl font-bold text-center text-white mb-6">Log in to HireTrack</h1>
      
      {state?.error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded mb-6 text-sm">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            ref={emailRef}
            required
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            ref={passwordRef}
            required
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Logging in...
            </>
          ) : 'Log In'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={fillDemoCredentials}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Prefill Demo Account (demo@demo.com / demo1234)
        </button>
      </div>

      <div className="mt-8 text-center text-sm text-gray-400">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium">
          Sign up
        </Link>
      </div>
    </div>
  );
}
