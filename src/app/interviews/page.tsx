import { getInterviews } from '@/lib/queries';
import { Badge } from '@/components/ui/Badge';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Interviews' };
export const dynamic = 'force-dynamic';

export default async function InterviewsPage() {
  const interviews = await getInterviews();
  const now = new Date();
  const upcoming = interviews.filter((i) => new Date(i.scheduledAt) >= now);
  const past = interviews.filter((i) => new Date(i.scheduledAt) < now);

  const InterviewCard = ({ interview }: { interview: (typeof interviews)[0] }) => (
    <div
      className="glass flex items-center justify-between rounded-xl px-5 py-4 transition-base hover:scale-[1.003]"
    >
      <div className="flex items-center gap-4">
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
          style={{ background: 'hsl(199,89%,48%,0.15)', color: 'hsl(199,89%,65%)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <div>
          <p className="font-semibold" style={{ color: 'hsl(210,40%,94%)' }}>
            {interview.application.candidate.name}
          </p>
          <p className="text-[13px]" style={{ color: 'hsl(215,20%,52%)' }}>
            {interview.application.job.title}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-sm font-medium" style={{ color: 'hsl(210,40%,88%)' }}>
            {new Date(interview.scheduledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <p className="text-[12px]" style={{ color: 'hsl(215,20%,50%)' }}>
            {new Date(interview.scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} · {interview.durationMinutes} min
          </p>
        </div>
        <Badge value={interview.status} />
        {interview.locationLink && (
          <a
            href={interview.locationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-3 py-1.5 text-[12px] font-semibold transition-base"
            style={{ background: 'hsl(199,89%,48%,0.15)', color: 'hsl(199,89%,65%)' }}
          >
            Join
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div className="animate-page px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'hsl(210,40%,96%)' }}>
          Interviews
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'hsl(215,20%,55%)' }}>
          {upcoming.length} upcoming · {past.length} past
        </p>
      </div>

      {upcoming.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'hsl(215,20%,48%)' }}>
            Upcoming
          </h2>
          <div className="space-y-3">
            {upcoming.map((i) => <InterviewCard key={i.id} interview={i} />)}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'hsl(215,20%,48%)' }}>
            Past
          </h2>
          <div className="space-y-3 opacity-70">
            {past.map((i) => <InterviewCard key={i.id} interview={i} />)}
          </div>
        </div>
      )}

      {interviews.length === 0 && (
        <div className="glass flex items-center justify-center rounded-xl py-20 text-sm" style={{ color: 'hsl(215,20%,45%)' }}>
          No interviews scheduled yet.
        </div>
      )}
    </div>
  );
}
