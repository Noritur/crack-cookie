import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { TopNav } from "@/components/layout/top-nav";
import { CookieCrack } from "@/components/cookie/cookie-crack";
import { CrackedFortune } from "@/components/cookie/cracked-fortune";
import { AlreadyCrackedEmpty } from "@/components/cookie/already-cracked-empty";
import { PublicNav } from "@/components/landing/public-nav";
import { HeroSection } from "@/components/landing/hero-section";
import { TrustStrip } from "@/components/landing/trust-strip";
import { LandingFooter } from "@/components/landing/landing-footer";

function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <PublicNav />
        <main className="flex flex-col">
          <HeroSection />
          <TrustStrip />
        </main>
        <LandingFooter />
      </div>
    );
  }

  const { data: todayRow } = await supabase
    .from("user_fortunes")
    .select("id, fortune_text, deleted_at")
    .eq("user_id", user.id)
    .eq("crack_date", todayUtc())
    .maybeSingle();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav activeHref="/" />
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-12">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Image
            src="/cookie/cracking-bg.png"
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 100vw, 0px"
            className="hidden object-cover opacity-20 md:block"
          />
          <Image
            src="/cookie/cracking-bg-mobile.png"
            alt=""
            fill
            priority
            sizes="(max-width: 767px) 100vw, 0px"
            className="block object-cover opacity-15 md:hidden"
          />
        </div>
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
