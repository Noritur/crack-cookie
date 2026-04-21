import { cn } from "@/lib/utils";

type DayPoint = {
  dateIso: string;
  label: string;
  count: number;
};

type Props = {
  data: ReadonlyArray<DayPoint>;
};

export function WeeklyActivity({ data }: Props) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-card p-5 ring-1 ring-border md:max-w-xl">
      <h2
        className="text-[16px] font-semibold text-foreground"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Активність за тижнем
      </h2>
      <div className="flex h-32 items-end justify-between gap-2">
        {data.map((d) => {
          const heightPct = (d.count / max) * 100;
          const isActive = d.count > 0;
          return (
            <div
              key={d.dateIso}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <div
                className={cn(
                  "w-full rounded-t-sm transition-all",
                  isActive ? "bg-primary" : "bg-muted/60",
                )}
                style={{ height: `${Math.max(6, heightPct)}%` }}
                aria-label={`${d.label}: ${d.count === 1 ? "1 печиво" : `${d.count} печива`}`}
              />
              <span
                className="text-[11px] uppercase text-muted-foreground"
                style={{ fontFamily: "var(--font-funnel-sans)" }}
              >
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
