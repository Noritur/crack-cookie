import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { TopNav } from "@/components/layout/top-nav";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { StatsGrid } from "@/components/profile/stats-grid";
import { WeeklyActivity } from "@/components/profile/weekly-activity";

const WEEKDAY_UA = ["нд", "пн", "вт", "ср", "чт", "пт", "сб"];

function nowMillis(): number {
  return Date.now();
}

function daysBetween(startIso: string, nowMs: number): number {
  const ms = nowMs - new Date(startIso).getTime();
  return Math.max(1, Math.floor(ms / 86_400_000) + 1);
}

function buildWeeklyActivity(
  rows: ReadonlyArray<{ created_at: string }>,
  nowMs: number,
): ReadonlyArray<{ dateIso: string; label: string; count: number }> {
  const now = new Date(nowMs);
  const todayUtcStart = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );
  const days: { dateIso: string; label: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const dayMs = todayUtcStart - i * 86_400_000;
    const d = new Date(dayMs);
    days.push({
      dateIso: d.toISOString().slice(0, 10),
      label: WEEKDAY_UA[d.getUTCDay()],
      count: 0,
    });
  }
  for (const r of rows) {
    const dateIso = r.created_at.slice(0, 10);
    const slot = days.find((s) => s.dateIso === dateIso);
    if (slot) slot.count++;
  }
  return days;
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: fortunes } = await supabase
    .from("user_fortunes")
    .select("id, created_at, is_favorite")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  const all = fortunes ?? [];
  const total = all.length;
  const favCount = all.filter((r) => r.is_favorite).length;
  const nowMs = nowMillis();
  const daysTogether = all.length > 0 ? daysBetween(all[0].created_at, nowMs) : 0;
  const weekly = buildWeeklyActivity(all, nowMs);

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20 md:pb-0">
      <TopNav activeHref="/profile" />
      <main className="flex flex-col">
        <section className="flex flex-col gap-6 px-6 pt-10 pb-16 md:px-12">
          <div className="flex flex-col gap-1.5">
            <h1
              className="text-[28px] font-bold text-foreground md:text-[32px]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Особистий кабінет
            </h1>
            <p className="text-[15px] text-muted-foreground">
              Відстежуй прогрес і повертайся до витягнутих передбачень
            </p>
          </div>

          {total === 0 ? (
            <EmptyProfile />
          ) : (
            <>
              <StatsGrid total={total} daysTogether={daysTogether} favCount={favCount} />
              <WeeklyActivity data={weekly} />
              <Link
                href="/account"
                className="group inline-flex items-center gap-2 self-start text-[14px] font-semibold text-primary"
              >
                Переглянути всю колекцію
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </section>
      </main>
      <MobileTabBar />
    </div>
  );
}

function EmptyProfile() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-card py-16 text-center md:max-w-xl">
      <span style={{ fontSize: 48, lineHeight: 1 }}>🥠</span>
      <h2
        className="text-[18px] font-semibold text-foreground"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {"Тут з'явиться твоя статистика"}
      </h2>
      <p className="max-w-sm text-[14px] text-muted-foreground">
        Розлами перше печиво — і ми почнемо вести облік.
      </p>
      <Link
        href="/"
        className="mt-1 text-[14px] font-semibold text-primary underline-offset-4 hover:underline"
      >
        розламати печиво →
      </Link>
    </div>
  );
}
