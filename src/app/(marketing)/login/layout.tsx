import type { ReactNode } from 'react';

export const metadata = {
  title: 'HireTrack – Sign In',
  description: 'Sign in or create your HireTrack account.',
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
