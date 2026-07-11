import { getJobById } from '@/lib/queries';
import { Badge } from '@/components/ui/Badge';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const job = await getJobById(id);
  return { title: job?.title ?? 'Job Not Found' };
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await getJobById(id);
  if (!job) notFound();

  return (
    <div className="animate-page px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm" style={{ color: 'hsl(215,20%,50%)' }}>
        <Link href="/jobs" className="transition-base hover:text-[hsl(210,40%,90%)]">Jobs</Link>
        <span>/</span>
        <span style={{ color: 'hsl(210,40%,85%)' }}>{job.title}</span>
      </div>

      {/* Job header */}
      <div className="glass mb-6 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'hsl(210,40%,96%)' }}>{job.title}</h1>
            <p className="mt-1 text-sm" style={{ color: 'hsl(215,20%,52%)' }}>
              {job.department} · {job.location}
            </p>
            {job.cutoffRequirements && (
              <p className="mt-3 text-sm" style={{ color: 'hsl(215,20%,60%)' }}>
                {job.cutoffRequirements}
              </p>
            )}
          </div>
          <Badge value={job.status} />
        </div>
      </div>

      {/* Applications */}
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest" style={{ color: 'hsl(215,20%,55%)' }}>
        Applications ({job.applications.length})
      </h2>

      {job.applications.length === 0 ? (
        <div className="glass flex items-center justify-center rounded-xl py-12 text-sm" style={{ color: 'hsl(215,20%,50%)' }}>
          No applications yet for this job.
        </div>
      ) : (
        <div className="space-y-3">
          {job.applications.map((app) => (
            <div key={app.id} className="glass flex items-center justify-between rounded-xl px-5 py-4 transition-base hover:scale-[1.003]">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold"
                  style={{ background: 'hsl(224,76%,48%,0.18)', color: 'hsl(224,76%,70%)' }}
                >
                  {app.candidate.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium" style={{ color: 'hsl(210,40%,93%)' }}>{app.candidate.name}</p>
                  <p className="text-[12px]" style={{ color: 'hsl(215,20%,50%)' }}>{app.candidate.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {app.scorecards.length > 0 && (
                  <span className="text-[12px]" style={{ color: 'hsl(215,20%,50%)' }}>
                    {app.scorecards.length} scorecard{app.scorecards.length !== 1 ? 's' : ''}
                  </span>
                )}
                <Badge value={app.stage} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
