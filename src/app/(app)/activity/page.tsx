import { getActivityLogs } from '@/lib/queries';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Activity' };
export const dynamic = 'force-dynamic';

const actionColors: Record<string, string> = {
  created: 'hsl(142,71%,50%)',
  stage_changed: 'hsl(224,76%,65%)',
  deleted: 'hsl(0,72%,60%)',
  updated: 'hsl(38,92%,55%)',
};

const actionEmoji: Record<string, string> = {
  created: '✦',
  stage_changed: '↗',
  deleted: '✕',
  updated: '✎',
};

export default async function ActivityPage() {
  const logs = await getActivityLogs();

  return (
    <div className="animate-page px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'hsl(210,40%,96%)' }}>
          Activity Log
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'hsl(215,20%,55%)' }}>
          Immutable audit trail of all actions in HireTrack.
        </p>
      </div>

      <div className="glass overflow-hidden rounded-xl">
        {logs.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-sm" style={{ color: 'hsl(215,20%,45%)' }}>
            No activity recorded yet.
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'hsl(217,32%,12%)' }}>
            {logs.map((log) => {
              const color = actionColors[log.action] ?? 'hsl(215,20%,55%)';
              const emoji = actionEmoji[log.action] ?? '·';
              let diff: Record<string, unknown> | null = null;
              try {
                if (log.diffMetadata) diff = JSON.parse(log.diffMetadata);
              } catch {}

              return (
                <div key={log.id} className="flex items-start gap-4 px-5 py-4 transition-base hover:bg-[hsl(222,38%,9%)]">
                  <div
                    className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[13px]"
                    style={{ background: `${color}18`, color }}
                  >
                    {emoji}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[13px] font-semibold" style={{ color }}>
                        {log.entityType}
                      </span>
                      <span className="text-[13px]" style={{ color: 'hsl(210,40%,80%)' }}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </div>
                    {diff && (
                      <p className="mt-0.5 font-mono text-[11px]" style={{ color: 'hsl(215,20%,48%)' }}>
                        {Object.entries(diff)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(' · ')}
                      </p>
                    )}
                  </div>
                  <time
                    className="flex-shrink-0 font-mono text-[11px]"
                    style={{ color: 'hsl(215,20%,40%)' }}
                    dateTime={log.createdAt.toISOString()}
                  >
                    {new Date(log.createdAt).toLocaleString('en-IN', {
                      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                    })}
                  </time>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
