import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TopNav } from "@/components/layout/top-nav";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { StatsCard } from "@/components/account/stats-card";
import { CollectionTabs, type Tab } from "@/components/account/collection-tabs";
import { FortuneCard } from "@/components/account/fortune-card";
import { SearchInput } from "@/components/account/search-input";
import { Button } from "@/components/ui/button";

function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}

const RECENT_DAYS = 3;

function recentCutoffIso() {
  return new Date(Date.now() - RECENT_DAYS * 864e5).toISOString();
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; q?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { tab: tabRaw, q: qRaw } = await searchParams;
  const tab: Tab =
    tabRaw === "fav" || tabRaw === "recent" ? tabRaw : "all";
  const q = (qRaw ?? "").trim().slice(0, 100);

  const { data: fortunes } = await supabase
    .from("user_fortunes")
    .select("id, fortune_text, created_at, is_favorite")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  const all = fortunes ?? [];
  const total = all.length;
  const favCount = all.filter((r) => r.is_favorite).length;

  const recentCutoff = recentCutoffIso();
  let rows = all;
  if (tab === "fav") rows = rows.filter((r) => r.is_favorite);
  if (tab === "recent") rows = rows.filter((r) => r.created_at >= recentCutoff);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter((r) => r.fortune_text.toLowerCase().includes(needle));
  }

  const { data: todayAny } = await supabase
    .from("user_fortunes")
    .select("id")
    .eq("user_id", user.id)
    .eq("crack_date", todayUtc())
    .maybeSingle();
  const crackedToday = Boolean(todayAny);

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20 md:pb-0">
      <TopNav activeHref="/account" />
      <main className="flex flex-col">
        <section className="flex flex-col gap-6 px-6 pt-10 pb-6 md:px-12">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div className="flex flex-col gap-1.5">
              <h1
                className="text-[28px] font-bold text-foreground md:text-[32px]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Твоя колекція передбачень
              </h1>
              <p className="text-[15px] text-muted-foreground">
                Кожне розкрите печиво, кожна збережена мудрість.
              </p>
            </div>
            {total > 0 && (
              <StatsCard total={total} favCount={favCount} />
            )}
          </div>
          {total > 0 && <SearchInput initialQ={q} tab={tab} />}
          <CollectionTabs active={tab} favCount={favCount} q={q} />
        </section>

        <section className="px-6 pb-16 md:px-12">
          {total === 0 ? (
            <EmptyState crackedToday={crackedToday} />
          ) : rows.length === 0 ? (
            <NoResultsState tab={tab} q={q} />
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
              {rows.map((row, idx) => (
                <FortuneCard
                  key={row.id}
                  id={row.id}
                  text={row.fortune_text}
                  createdAt={row.created_at}
                  isFavorite={row.is_favorite}
                  featured={!q && tab === "all" && idx === 0}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <MobileTabBar />
    </div>
  );
}

function NoResultsState({ tab, q }: { tab: Tab; q: string }) {
  if (q) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card py-14 text-center">
        <span style={{ fontSize: 48, lineHeight: 1 }}>🔍</span>
        <h2
          className="text-[18px] font-semibold text-foreground"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Нічого не знайдено за «{q}»
        </h2>
        <Link
          href={tab === "all" ? "/account" : `/account?tab=${tab}`}
          className="text-[14px] font-semibold text-primary underline-offset-4 hover:underline"
        >
          скинути пошук
        </Link>
      </div>
    );
  }

  if (tab === "recent") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card py-14 text-center">
        <span style={{ fontSize: 48, lineHeight: 1 }}>🗓️</span>
        <h2
          className="text-[18px] font-semibold text-foreground"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {`За ${RECENT_DAYS} дні немає печива`}
        </h2>
        <p className="max-w-sm text-[14px] text-muted-foreground">
          {"Розлами одне сьогодні — воно з'явиться тут."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card py-14 text-center">
      <span style={{ fontSize: 48, lineHeight: 1 }}>⭐️</span>
      <h2
        className="text-[18px] font-semibold text-foreground"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Поки жодної обраної
      </h2>
      <p className="max-w-sm text-[14px] text-muted-foreground">
        Тисни на зірку в картці, щоб зберегти фортуну сюди.
      </p>
    </div>
  );
}

function EmptyState({ crackedToday }: { crackedToday: boolean }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-card py-16 text-center">
      <span style={{ fontSize: 56, lineHeight: 1 }}>🥠</span>
      <h2
        className="text-[20px] font-semibold text-foreground"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {crackedToday ? "Колекція поки що порожня" : "Поки що тихо всередині"}
      </h2>
      <p className="max-w-sm text-[14px] text-muted-foreground">
        {crackedToday
          ? "Сьогоднішнє передбачення видалено. Нове буде доступне завтра."
          : "Розлами перше печиво — і воно з'явиться тут назавжди."}
      </p>
      {!crackedToday && (
        <Link href="/" className="mt-2">
          <Button className="h-11 rounded-full px-6 text-[14px] font-semibold">
            Розламати печиво
          </Button>
        </Link>
      )}
    </div>
  );
}
