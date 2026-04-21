type Props = {
  total: number;
  favCount: number;
};

export function StatsCard({ total, favCount }: Props) {
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
          {favCount}
        </span>
        <span
          className="text-[12px] text-muted-foreground"
          style={{ fontFamily: "var(--font-funnel-sans)" }}
        >
          {favCount === 1 ? "обране" : "обраних"}
        </span>
      </div>
    </div>
  );
}
