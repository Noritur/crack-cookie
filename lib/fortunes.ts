import { createClient } from "@/lib/supabase/server";

export type DailyFortune = {
  text: string;
  date: string;
};

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysSinceEpochUtc(): number {
  return Math.floor(Date.now() / 86_400_000);
}

export async function fortuneOfTheDay(): Promise<DailyFortune | null> {
  const supabase = await createClient();

  const { count } = await supabase
    .from("fortunes")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true);

  if (!count || count <= 0) return null;

  const index = daysSinceEpochUtc() % count;

  const { data } = await supabase
    .from("fortunes")
    .select("text")
    .eq("is_active", true)
    .order("id", { ascending: true })
    .range(index, index)
    .maybeSingle();

  if (!data?.text) return null;

  return { text: data.text, date: todayUtc() };
}
