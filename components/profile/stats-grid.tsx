type Props = {
  total: number;
  daysTogether: number;
  favCount: number;
};

export function StatsGrid({ total, daysTogether, favCount }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3 md:max-w-xl">
      <StatCard value={total} label="всього печива" />
      <StatCard value={daysTogether} label={daysTogether === 1 ? "день з нами" : "днів з нами"} />
      <StatCard value={favCount} label={favCount === 1 ? "обране" : "обрано"} />
    </div>
  );
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-card p-5 ring-1 ring-border">
      <span
        className="text-[28px] font-bold text-foreground leading-none"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {value}
      </span>
      <span
        className="text-[12px] text-muted-foreground"
        style={{ fontFamily: "var(--font-funnel-sans)" }}
      >
        {label}
      </span>
    </div>
  );
}
