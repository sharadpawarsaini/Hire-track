import { getDashboardStats } from '@/lib/queries';
import { StatsCard } from '@/components/ui/StatsCard';
import { Badge } from '@/components/ui/Badge';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard' };

export const dynamic = 'force-dynamic';

const actionLabel: Record<string, string> = {
  created: 'created',
  stage_changed: 'moved application',
};

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="animate-page px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'hsl(210,40%,96%)' }}>
          Dashboard
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'hsl(215,20%,55%)' }}>
          Welcome back, Demo Owner — here&apos;s what&apos;s happening at Acme Corp.
        </p>
      </div>

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatsCard
          label="Total Jobs"
          value={stats.totalJobs}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>}
          accent="hsl(224,76%,55%)"
        />
        <StatsCard
          label="Open Roles"
          value={stats.openJobs}
          delta="Actively hiring"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
          accent="hsl(142,71%,45%)"
        />
        <StatsCard
          label="Candidates"
          value={stats.totalCandidates}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>}
          accent="hsl(280,70%,60%)"
        />
        <StatsCard
          label="Applications"
          value={stats.totalApplications}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>}
          accent="hsl(38,92%,50%)"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        {/* Stage Breakdown */}
        <div className="glass xl:col-span-2 rounded-xl p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest" style={{ color: 'hsl(215,20%,55%)' }}>
            Pipeline Breakdown
          </h2>
          <div className="space-y-3">
            {stats.stageBreakdown.map((s) => (
              <div key={s.stage} className="flex items-center justify-between">
                <Badge value={s.stage} />
                <span className="text-sm font-semibold" style={{ color: 'hsl(210,40%,92%)' }}>
                  {s._count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass xl:col-span-3 rounded-xl p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest" style={{ color: 'hsl(215,20%,55%)' }}>
            Recent Activity
          </h2>
          <div className="space-y-3">
            {stats.recentActivity.length === 0 && (
              <p className="text-sm" style={{ color: 'hsl(215,20%,45%)' }}>No activity yet.</p>
            )}
            {stats.recentActivity.map((log) => (
              <div key={log.id} className="flex items-start gap-3">
                <div
                  className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full"
                  style={{ background: 'hsl(224,76%,55%)' }}
                />
                <div>
                  <p className="text-[13px]" style={{ color: 'hsl(210,40%,88%)' }}>
                    <span className="font-medium">{log.entityType}</span>{' '}
                    {actionLabel[log.action] ?? log.action}
                  </p>
                  <p className="text-[11px]" style={{ color: 'hsl(215,20%,45%)' }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
