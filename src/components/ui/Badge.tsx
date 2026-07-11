type Stage = 'APPLIED' | 'SCREEN' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED';
type Status = 'OPEN' | 'DRAFT' | 'CLOSED';

const stageCls: Record<string, string> = {
  APPLIED: 'badge-applied',
  SCREEN: 'badge-screen',
  INTERVIEW: 'badge-interview',
  OFFER: 'badge-offer',
  HIRED: 'badge-hired',
  REJECTED: 'badge-rejected',
  OPEN: 'badge-open',
  DRAFT: 'badge-draft',
  CLOSED: 'badge-closed',
};

export function Badge({ value }: { value: Stage | Status | string }) {
  const cls = stageCls[value] ?? 'badge-draft';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${cls}`}
    >
      {value}
    </span>
  );
}
