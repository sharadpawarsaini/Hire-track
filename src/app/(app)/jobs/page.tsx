import { getJobs } from '@/lib/queries';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Jobs' };
export const dynamic = 'force-dynamic';

import JobsHeader from '@/components/jobs/JobsHeader';

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <div className="animate-page px-8 py-8">
      <JobsHeader totalJobs={jobs.length} />

      {jobs.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center rounded-xl py-20 text-center">
          <p className="text-lg font-medium" style={{ color: 'hsl(215,20%,60%)' }}>No jobs yet</p>
          <p className="mt-1 text-sm" style={{ color: 'hsl(215,20%,45%)' }}>Create your first job requisition to start hiring.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="glass group flex items-center justify-between rounded-xl p-5 transition-base hover:scale-[1.005]"
              style={{ borderColor: 'hsl(217,32%,17%)' }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold"
                  style={{ background: 'hsl(224,76%,48%,0.15)', color: 'hsl(224,76%,65%)' }}
                >
                  {job.title.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold group-hover:text-[hsl(224,76%,70%)] transition-base" style={{ color: 'hsl(210,40%,94%)' }}>
                    {job.title}
                  </p>
                  <p className="text-[13px]" style={{ color: 'hsl(215,20%,52%)' }}>
                    {job.department} · {job.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="text-right">
                  <p className="text-lg font-bold" style={{ color: 'hsl(210,40%,92%)' }}>
                    {job._count.applications}
                  </p>
                  <p className="text-[11px]" style={{ color: 'hsl(215,20%,48%)' }}>
                    applicants
                  </p>
                </div>
                <Badge value={job.status} />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'hsl(215,20%,40%)' }}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
