import { getCandidates } from '@/lib/queries';
import { Badge } from '@/components/ui/Badge';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Candidates' };
export const dynamic = 'force-dynamic';

export default async function CandidatesPage() {
  const candidates = await getCandidates();

  return (
    <div className="animate-page px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'hsl(210,40%,96%)' }}>
            Candidates
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'hsl(215,20%,55%)' }}>
            {candidates.length} candidate{candidates.length !== 1 ? 's' : ''} in your talent pool
          </p>
        </div>
        <button
          id="btn-add-candidate"
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-base"
          style={{ background: 'hsl(224,76%,48%)', color: 'white' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Candidate
        </button>
      </div>

      {/* Table */}
      <div className="glass overflow-hidden rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid hsl(217,32%,15%)', background: 'hsl(222,40%,6%)' }}>
              {['Candidate', 'Email', 'Source', 'Applications', 'Latest Stage', 'Added'].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-widest"
                  style={{ color: 'hsl(215,20%,48%)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {candidates.map((c, i) => (
              <tr
                key={c.id}
                className="transition-base hover:bg-[hsl(222,38%,9%)]"
                style={{ borderBottom: i < candidates.length - 1 ? '1px solid hsl(217,32%,12%)' : 'none' }}
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-semibold"
                      style={{ background: 'hsl(280,70%,55%,0.18)', color: 'hsl(280,70%,72%)' }}
                    >
                      {c.name.charAt(0)}
                    </div>
                    <span className="font-medium" style={{ color: 'hsl(210,40%,93%)' }}>{c.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5" style={{ color: 'hsl(215,20%,55%)' }}>{c.email}</td>
                <td className="px-5 py-3.5" style={{ color: 'hsl(215,20%,55%)' }}>{c.source ?? '—'}</td>
                <td className="px-5 py-3.5 font-medium" style={{ color: 'hsl(210,40%,88%)' }}>
                  {c._count.applications}
                </td>
                <td className="px-5 py-3.5">
                  {c.applications[0] ? <Badge value={c.applications[0].stage} /> : <span style={{ color: 'hsl(215,20%,40%)' }}>—</span>}
                </td>
                <td className="px-5 py-3.5 font-mono text-[12px]" style={{ color: 'hsl(215,20%,45%)' }}>
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {candidates.length === 0 && (
          <div className="flex items-center justify-center py-16 text-sm" style={{ color: 'hsl(215,20%,45%)' }}>
            No candidates yet — add your first one.
          </div>
        )}
      </div>
    </div>
  );
}
