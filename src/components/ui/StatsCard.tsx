export function StatsCard({
  label,
  value,
  delta,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  delta?: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div
      className="glass animate-page rounded-xl p-5 transition-base hover:scale-[1.01]"
      style={{ boxShadow: `0 0 18px ${accent}14` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="mb-1 text-[12px] font-medium uppercase tracking-widest" style={{ color: 'hsl(215,20%,55%)' }}>
            {label}
          </p>
          <p className="text-3xl font-bold" style={{ color: 'hsl(210,40%,96%)' }}>
            {value}
          </p>
          {delta && (
            <p className="mt-1 text-[12px]" style={{ color: 'hsl(142,71%,50%)' }}>
              {delta}
            </p>
          )}
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ background: `${accent}22`, color: accent }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
