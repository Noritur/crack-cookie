"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        return;
      }
      router.replace(redirectTo ?? "/");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="ти@приклад.com"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Пароль</Label>
          <Link
            href="/forgot-password"
            className="text-[13px] text-muted-foreground hover:text-primary"
            style={{ fontFamily: "var(--font-funnel-sans)" }}
          >
            Забув пароль?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={6}
        />
      </div>
      <Button
        type="submit"
        disabled={pending}
        className="mt-2 h-12 w-full rounded-full text-sm font-medium"
      >
        {pending ? "Входимо…" : "Увійти"}
      </Button>
      <div className="flex items-center gap-3 pt-2 text-[13px] text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        <span>або через</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          disabled
          className="h-10 rounded-full"
          title="Скоро"
        >
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled
          className="h-10 rounded-full"
          title="Скоро"
        >
          Apple
        </Button>
      </div>
      <p className="pt-2 text-center text-[13px] text-muted-foreground">
        Ще немає акаунту?{" "}
        <Link href="/signup" className="font-semibold text-primary">
          Зареєструватися
        </Link>
      </p>
    </form>
  );
}
