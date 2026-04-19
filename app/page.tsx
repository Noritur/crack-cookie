import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TopNav } from "@/components/layout/top-nav";
import { CookieCrack } from "@/components/cookie/cookie-crack";
import { CrackedFortune } from "@/components/cookie/cracked-fortune";
import { AlreadyCrackedEmpty } from "@/components/cookie/already-cracked-empty";

function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: todayRow } = await supabase
    .from("user_fortunes")
    .select("id, fortune_text, deleted_at")
    .eq("user_id", user.id)
    .eq("crack_date", todayUtc())
    .maybeSingle();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav activeHref="/" />
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        {todayRow ? (
          todayRow.deleted_at ? (
            <AlreadyCrackedEmpty />
          ) : (
            <CrackedFortune text={todayRow.fortune_text} />
          )
        ) : (
          <CookieCrack />
        )}
      </main>
    </div>
  );
}
