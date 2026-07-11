import './globals.css';
import MarketingNavbar from '@/components/MarketingNavbar';
import MarketingFooter from '@/components/MarketingFooter';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'HireTrack – Modern ATS',
  description: 'Hire smarter with HireTrack – a premium, dark‑theme applicant tracking system.',
};

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full bg-gray-900 text-gray-100">
      <body className="flex flex-col min-h-screen relative pt-16">
        <MarketingNavbar />
        <main className="flex-1 container mx-auto px-4 py-8 mt-8">
          {children}
        </main>
        <MarketingFooter />
      </body>
    </html>
  );
}
