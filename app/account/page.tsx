import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TopNav } from "@/components/layout/top-nav";
import { StatsCard } from "@/components/account/stats-card";
import { CollectionTabs } from "@/components/account/collection-tabs";
import { FortuneCard } from "@/components/account/fortune-card";
import { Button } from "@/components/ui/button";

function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}

type Tab = "all" | "fav";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { tab: tabRaw } = await searchParams;
  const tab: Tab = tabRaw === "fav" ? "fav" : "all";

  const { data: fortunes } = await supabase
    .from("user_fortunes")
    .select("id, fortune_text, created_at, is_favorite")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  const all = fortunes ?? [];
  const total = all.length;
  const favCount = all.filter((r) => r.is_favorite).length;
  const rows = tab === "fav" ? all.filter((r) => r.is_favorite) : all;
  const firstCrackAt =
    all.length > 0 ? all[all.length - 1].created_at : null;

  const { data: todayAny } = await supabase
    .from("user_fortunes")
    .select("id")
    .eq("user_id", user.id)
    .eq("crack_date", todayUtc())
    .maybeSingle();
  const crackedToday = Boolean(todayAny);

  return (
    <div className="flex min-h-screen flex-col bg-background">
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
              <StatsCard total={total} firstCrackAt={firstCrackAt} />
            )}
          </div>
          <CollectionTabs active={tab} favCount={favCount} />
        </section>

        <section className="px-6 pb-16 md:px-12">
          {total === 0 ? (
            <EmptyState crackedToday={crackedToday} />
          ) : rows.length === 0 ? (
            <FavEmptyState />
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
              {rows.map((row, idx) => (
                <FortuneCard
                  key={row.id}
                  id={row.id}
                  text={row.fortune_text}
                  createdAt={row.created_at}
                  isFavorite={row.is_favorite}
                  featured={tab === "all" && idx === 0}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function FavEmptyState() {
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
