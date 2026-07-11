import type { Metadata, Viewport } from 'next';
import '../globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Toaster } from '@/components/ui/Toaster';

export const metadata: Metadata = {
  title: { default: 'HireTrack', template: '%s | HireTrack' },
  description: 'Collaborative Applicant Tracking System — hire smarter, faster.',
  keywords: ['ATS', 'applicant tracking', 'hiring', 'recruitment', 'scorecards'],
  authors: [{ name: 'HireTrack' }],
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
};

import { getCurrentUser } from '@/lib/auth';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="en" className="dark">
      <body className="flex h-screen overflow-hidden">
        <Sidebar user={user} />
        <main className="flex-1 overflow-y-auto bg-[hsl(222,47%,4%)]">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
