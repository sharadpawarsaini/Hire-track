import { getPipelineData } from '@/lib/queries';
import { Badge } from '@/components/ui/Badge';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Pipeline' };
export const dynamic = 'force-dynamic';

const STAGE_LABELS: Record<string, string> = {
  APPLIED: 'Applied',
  SCREEN: 'Screen',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  HIRED: 'Hired',
  REJECTED: 'Rejected',
};

const STAGE_COLORS: Record<string, string> = {
  APPLIED:   'hsl(215,20%,55%)',
  SCREEN:    'hsl(280,70%,65%)',
  INTERVIEW: 'hsl(224,76%,65%)',
  OFFER:     'hsl(38,92%,55%)',
  HIRED:     'hsl(142,71%,50%)',
  REJECTED:  'hsl(0,72%,60%)',
};

export default async function PipelinePage() {
  const pipeline = await getPipelineData();

  return (
    <div className="animate-page flex h-full flex-col px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'hsl(210,40%,96%)' }}>
          Pipeline
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'hsl(215,20%,55%)' }}>
          Kanban view of all applications across hiring stages.
        </p>
      </div>

      {/* Kanban board */}
      <div className="flex flex-1 gap-4 overflow-x-auto pb-4">
        {Object.entries(pipeline).map(([stage, apps]) => (
          <div
            key={stage}
            className="flex w-[260px] flex-shrink-0 flex-col rounded-xl"
            style={{ background: 'hsl(222,40%,6%)', border: '1px solid hsl(217,32%,13%)' }}
          >
            {/* Column header */}
            <div
              className="flex items-center justify-between rounded-t-xl px-4 py-3"
              style={{ borderBottom: '1px solid hsl(217,32%,13%)' }}
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ background: STAGE_COLORS[stage] }} />
                <span className="text-[13px] font-semibold" style={{ color: 'hsl(210,40%,88%)' }}>
                  {STAGE_LABELS[stage]}
                </span>
              </div>
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold"
                style={{ background: `${STAGE_COLORS[stage]}22`, color: STAGE_COLORS[stage] }}
              >
                {apps.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-3">
              {apps.length === 0 && (
                <div
                  className="flex items-center justify-center rounded-lg py-8 text-[12px]"
                  style={{ color: 'hsl(215,20%,35%)', border: '1px dashed hsl(217,32%,15%)' }}
                >
                  No candidates
                </div>
              )}
              {apps.map((app) => (
                <div
                  key={app.id}
                  className="group cursor-pointer rounded-lg p-3.5 transition-base hover:scale-[1.02]"
                  style={{ background: 'hsl(222,40%,9%)', border: '1px solid hsl(217,32%,15%)' }}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                      style={{ background: `${STAGE_COLORS[stage]}20`, color: STAGE_COLORS[stage] }}
                    >
                      {app.candidate.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="truncate text-[13px] font-semibold" style={{ color: 'hsl(210,40%,93%)' }}>
                        {app.candidate.name}
                      </p>
                      <p className="truncate text-[11px]" style={{ color: 'hsl(215,20%,50%)' }}>
                        {app.candidate.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] truncate pr-2" style={{ color: 'hsl(215,20%,48%)' }}>
                      {app.job.title}
                    </p>
                    {app._count.scorecards > 0 && (
                      <span className="flex items-center gap-1 text-[11px]" style={{ color: 'hsl(38,92%,55%)' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        {app._count.scorecards}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
