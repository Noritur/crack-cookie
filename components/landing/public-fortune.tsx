import { Sparkles } from "lucide-react";
import { fortuneOfTheDay } from "@/lib/fortunes";

const MONTHS_UA = [
  "січня", "лютого", "березня", "квітня", "травня", "червня",
  "липня", "серпня", "вересня", "жовтня", "листопада", "грудня",
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS_UA[d.getMonth()]}`;
}

export async function PublicFortune() {
  const fortune = await fortuneOfTheDay();
  if (!fortune) return null;

  return (
    <aside className="rounded-2xl bg-card p-6 ring-1 ring-border shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:p-7">
      <span
        className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-primary"
        style={{ fontFamily: "var(--font-funnel-sans)" }}
      >
        <Sparkles className="size-3.5" />
        сьогодні світу випало
      </span>
      <p
        className="mt-3 text-[20px] leading-snug text-foreground md:text-[22px]"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        «{fortune.text}»
      </p>
      <p
        className="mt-3 text-[13px] text-muted-foreground"
        style={{ fontFamily: "var(--font-funnel-sans)" }}
      >
        {formatDate(fortune.date)}
      </p>
    </aside>
  );
}
