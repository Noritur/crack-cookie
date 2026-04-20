const STATS = [
  { value: "1M+", label: "розкритих передбачень" },
  { value: "500+", label: "унікальних мудростей" },
  { value: "4.9", label: "середній рейтинг" },
] as const;

export function TrustStrip() {
  return (
    <div className="border-t border-border/60 px-6 py-10 md:px-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-16">
        {STATS.map((s) => (
          <div key={s.value} className="flex flex-col gap-1">
            <span
              className="text-[28px] font-bold text-foreground"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {s.value}
            </span>
            <span
              className="text-[14px] text-muted-foreground"
              style={{ fontFamily: "var(--font-funnel-sans)" }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
