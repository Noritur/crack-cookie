"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { crackFortune } from "@/app/actions/crack";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Phase = "idle" | "cracking" | "revealed";

export function CookieCrack() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [fortuneText, setFortuneText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function onCrack() {
    if (phase !== "idle") return;
    setError(null);
    setPhase("cracking");
    startTransition(async () => {
      await new Promise((r) => setTimeout(r, 900));
      const res = await crackFortune();
      if (!res.ok) {
        if (res.reason === "already_today") {
          router.refresh();
          return;
        }
        setError(
          res.reason === "empty_catalog"
            ? "каталог порожній, спробуй пізніше"
            : "щось пішло не так, спробуй ще раз"
        );
        setPhase("idle");
        return;
      }
      setFortuneText(res.fortune.fortune_text);
      setPhase("revealed");
    });
  }

  if (phase === "revealed" && fortuneText) {
    return (
      <div className="flex max-w-xl flex-col items-center gap-7 text-center animate-fortune-reveal">
        <p
          className="text-[12px] font-medium uppercase tracking-[0.24em] text-muted-foreground"
          style={{ fontFamily: "var(--font-funnel-sans)" }}
        >
          твоє передбачення
        </p>
        <p
          className="text-[26px] font-medium leading-snug text-foreground md:text-[32px]"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          «{fortuneText}»
        </p>
        <p className="text-[14px] text-muted-foreground">
          Повертайся завтра за новою мудрістю.
        </p>
        <Link
          href="/account"
          className="text-[14px] font-semibold text-primary underline-offset-4 hover:underline"
        >
          переглянути колекцію →
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <p
        className="text-[12px] font-medium uppercase tracking-[0.24em] text-muted-foreground"
        style={{ fontFamily: "var(--font-funnel-sans)" }}
      >
        твоє печиво готове
      </p>

      <button
        type="button"
        onClick={onCrack}
        disabled={phase !== "idle"}
        aria-label="Розламати печиво"
        className={cn(
          "relative size-50 md:size-65 overflow-hidden rounded-full outline-none",
          "shadow-[0_12px_40px_-4px_rgba(255,92,0,0.35),_0_4px_12px_-2px_rgba(255,92,0,0.2)]",
          "transition-transform duration-200 ease-out",
          "focus-visible:ring-4 focus-visible:ring-primary/30",
          phase === "idle" &&
            "hover:scale-105 active:scale-95 cursor-pointer animate-cookie-idle",
          phase === "cracking" && "animate-cookie-shake"
        )}
      >
        <Image
          src="/cookie/cookie.png"
          alt=""
          fill
          priority
          sizes="(min-width: 768px) 260px, 0px"
          className="hidden object-cover md:block"
        />
        <Image
          src="/cookie/cookie-mobile.png"
          alt=""
          fill
          priority
          sizes="(max-width: 767px) 200px, 0px"
          className="block object-cover md:hidden"
        />
      </button>

      <p className="text-[15px] text-muted-foreground">
        {phase === "cracking" ? "тріщить..." : "Яка мудрість чекає всередині?"}
      </p>

      <Button
        type="button"
        onClick={onCrack}
        disabled={phase !== "idle"}
        className="h-12 rounded-full px-8 text-[14px] font-semibold"
      >
        {phase === "cracking" ? "розламуємо..." : "Торкнись, щоб розламати"}
      </Button>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
