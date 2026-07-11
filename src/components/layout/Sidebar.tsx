'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/lib/auth-actions';

interface UserSession {
  userId: string;
  name: string;
  email: string;
  role: string;
  orgId: string;
}

const nav = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: 'Jobs',
    href: '/jobs',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
  },
  {
    label: 'Candidates',
    href: '/candidates',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: 'Pipeline',
    href: '/pipeline',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12H2" /><path d="M5 12V6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v6" />
        <path d="M5 12v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6" />
      </svg>
    ),
  },
  {
    label: 'Interviews',
    href: '/interviews',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    label: 'Activity',
    href: '/activity',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];

export function Sidebar({ user }: { user: UserSession | null }) {
  const pathname = usePathname();

  const displayName = user?.name || 'Demo Owner';
  const displayEmail = user?.email || 'demo@demo.com';
  
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const handleLogout = async () => {
    await logoutAction();
    window.location.href = '/login';
  };

  return (
    <aside
      className="flex h-screen w-[220px] flex-shrink-0 flex-col"
      style={{ background: 'hsl(222,40%,6%)', borderRight: '1px solid hsl(217,32%,13%)' }}
    >
      {/* Brand */}
      <div className="flex h-[60px] items-center gap-2.5 px-5" style={{ borderBottom: '1px solid hsl(217,32%,13%)' }}>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: 'hsl(224,76%,48%)', boxShadow: '0 0 14px hsl(224,76%,48%,0.4)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
        </div>
        <Link href="/" className="text-[15px] font-semibold tracking-tight hover:text-indigo-400 transition-colors" style={{ color: 'hsl(210,40%,96%)' }}>
          HireTrack
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-0.5 px-2 py-4">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 rounded-md px-3 py-2 text-[13.5px] font-medium transition-base"
              style={{
                color: active ? 'hsl(210,40%,96%)' : 'hsl(215,20%,55%)',
                background: active ? 'hsl(224,76%,48%,0.14)' : 'transparent',
                borderLeft: active ? '2px solid hsl(224,76%,55%)' : '2px solid transparent',
              }}
            >
              <span
                className="transition-base"
                style={{ color: active ? 'hsl(224,76%,70%)' : 'hsl(215,20%,45%)' }}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 space-y-3" style={{ borderTop: '1px solid hsl(217,32%,13%)' }}>
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-semibold uppercase flex-shrink-0"
            style={{ background: 'hsl(224,76%,48%,0.25)', color: 'hsl(224,76%,72%)' }}
          >
            {initials}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-[13px] font-medium" style={{ color: 'hsl(210,40%,92%)' }}>
              {displayName}
            </p>
            <p className="truncate text-[11px]" style={{ color: 'hsl(215,20%,50%)' }}>
              {displayEmail}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 rounded-md px-3 py-1.5 text-[12.5px] font-medium text-red-400 hover:text-red-355 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
