"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Tab } from "@/components/account/collection-tabs";

type Props = {
  initialQ: string;
  tab: Tab;
};

function buildUrl(tab: Tab, q: string): string {
  const params = new URLSearchParams();
  if (tab !== "all") params.set("tab", tab);
  if (q) params.set("q", q);
  const qs = params.toString();
  return qs ? `/account?${qs}` : "/account";
}

export function SearchInput({ initialQ, tab }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(initialQ);
  const [syncedInitial, setSyncedInitial] = useState(initialQ);
  const [, startTransition] = useTransition();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (initialQ !== syncedInitial) {
    setSyncedInitial(initialQ);
    setValue(initialQ);
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function scheduleNav(next: string) {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      startTransition(() => {
        router.replace(buildUrl(tab, next.trim()));
      });
    }, 300);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setValue(next);
    scheduleNav(next);
  }

  function handleClear() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setValue("");
    startTransition(() => {
      router.replace(buildUrl(tab, ""));
    });
  }

  return (
    <div className="relative w-full md:max-w-sm">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="Шукати в моїй колекції…"
        aria-label="Пошук передбачень"
        className="h-10 rounded-full pl-9 pr-9 text-[14px]"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Очистити пошук"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
