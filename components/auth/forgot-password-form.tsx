"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ForgotPasswordForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "").trim();

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });
      if (error) {
        setError(error.message);
        return;
      }
      setInfo(
        "Готово. Якщо такий email існує — лист з посиланням вже летить."
      );
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {info && (
        <Alert>
          <AlertDescription>{info}</AlertDescription>
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
          placeholder="you@example.com"
        />
      </div>
      <Button
        type="submit"
        disabled={pending}
        className="mt-2 h-12 w-full rounded-full text-sm font-medium"
      >
        {pending ? "Надсилаю…" : "Надіслати посилання"}
      </Button>
      <p className="pt-2 text-center text-[13px] text-muted-foreground">
        Згадав пароль?{" "}
        <Link href="/login" className="font-semibold text-primary">
          Увійти
        </Link>
      </p>
    </form>
  );
}
