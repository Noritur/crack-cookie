"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Library, User } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = {
  href: string;
  label: string;
  icon: typeof Home;
};

const items: ReadonlyArray<Item> = [
  { href: "/", label: "Головна", icon: Home },
  { href: "/account", label: "Колекція", icon: Library },
  { href: "/profile", label: "Профіль", icon: User },
];

export function MobileTabBar() {
  const pathname = usePathname();
  const activeHref =
    pathname === "/account" ? "/account" : pathname === "/profile" ? "/profile" : "/";

  return (
    <nav
      aria-label="Основна навігація"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-border/60 bg-background/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex items-center justify-around px-4 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === activeHref;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-wider transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                style={{ fontFamily: "var(--font-funnel-sans)" }}
              >
                <Icon className="size-5" aria-hidden />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
