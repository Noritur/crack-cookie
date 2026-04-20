"use client";

import { useActionState } from "react";
import { Mail, Send } from "lucide-react";
import { requestMagicLink } from "@/app/actions/signup";
import { Button } from "@/components/ui/button";

const ERRORS: Record<string, string> = {
  invalid_email: "схоже, пошта не зовсім валідна",
  rate_limited: "забагато спроб — спробуй за хвилину",
  unknown: "щось пішло не так, спробуй ще раз",
};

export function EmailCapture() {
  const [state, formAction, isPending] = useActionState(requestMagicLink, null);

  if (state?.ok) {
    return (
      <div className="flex flex-col gap-2 rounded-xl bg-card p-5 ring-1 ring-border">
        <span
          className="inline-flex items-center gap-2 text-[14px] font-semibold text-foreground"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          <Mail className="size-4 text-primary" /> лист полетів
        </span>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          відкрий пошту <span className="font-medium text-foreground">{state.email}</span> і натисни посилання — повернешся сюди залогіненим і розламаєш перше печиво.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-2" id="start">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="твоя пошта"
            disabled={isPending}
            aria-label="Email"
            className="h-12 w-full rounded-full border border-border bg-background pl-11 pr-4 text-[15px] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          />
        </div>
        <Button
          type="submit"
          disabled={isPending}
          className="h-12 rounded-full px-6 text-[14px] font-semibold"
        >
          <Send className="size-4" />
          {isPending ? "відправляю..." : "отримати передбачення"}
        </Button>
      </div>
      {state && !state.ok && (
        <p
          role="alert"
          className="text-[13px] text-destructive"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          {ERRORS[state.reason]}
        </p>
      )}
      <p
        className="text-[12px] text-muted-foreground"
        style={{ fontFamily: "var(--font-funnel-sans)" }}
      >
        прилетить magic-link. без паролів, без спаму.
      </p>
    </form>
  );
}
