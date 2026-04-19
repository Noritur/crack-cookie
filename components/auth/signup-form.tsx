"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function SignupForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [terms, setTerms] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (!terms) {
      setError("Треба прийняти Умови і Політику приватності.");
      return;
    }
    const formData = new FormData(e.currentTarget);
    const fullName = String(formData.get("full_name") ?? "").trim();
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    startTransition(async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setError(error.message);
        return;
      }
      if (data.session) {
        router.replace("/");
        router.refresh();
      } else {
        setInfo(
          "Перевір пошту — ми надіслали посилання для підтвердження."
        );
      }
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
        <Label htmlFor="full_name">Ім&apos;я</Label>
        <Input
          id="full_name"
          name="full_name"
          type="text"
          autoComplete="name"
          required
          placeholder="Нікола Тесла"
        />
      </div>
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
        <Label htmlFor="password">Пароль</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
        />
      </div>
      <label className="flex items-center gap-2 text-[13px] text-muted-foreground">
        <Checkbox
          checked={terms}
          onCheckedChange={(v) => setTerms(v === true)}
        />
        <span>Приймаю Умови та Політику приватності</span>
      </label>
      <Button
        type="submit"
        disabled={pending}
        className="mt-2 h-12 w-full rounded-full text-sm font-medium"
      >
        {pending ? "Створюємо акаунт…" : "Створити акаунт"}
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
        Вже є акаунт?{" "}
        <Link href="/login" className="font-semibold text-primary">
          Увійти
        </Link>
      </p>
    </form>
  );
}
