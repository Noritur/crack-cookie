type Props = {
  total: number;
  firstCrackAt: string | null;
};

function daysSince(iso: string): number {
  const first = new Date(iso);
  const now = new Date();
  const ms = now.getTime() - first.getTime();
  return Math.max(1, Math.floor(ms / (1000 * 60 * 60 * 24)) + 1);
}

export function StatsCard({ total, firstCrackAt }: Props) {
  const days = firstCrackAt ? daysSince(firstCrackAt) : 0;
  return (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-end gap-0.5">
        <span
          className="text-[28px] font-bold text-primary leading-none"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {total}
        </span>
        <span
          className="text-[12px] text-muted-foreground"
          style={{ fontFamily: "var(--font-funnel-sans)" }}
        >
          передбачень
        </span>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <span
          className="text-[28px] font-bold text-foreground leading-none"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {days}
        </span>
        <span
          className="text-[12px] text-muted-foreground"
          style={{ fontFamily: "var(--font-funnel-sans)" }}
        >
          {days === 1 ? "день разом" : "днів разом"}
        </span>
      </div>
    </div>
  );
}
