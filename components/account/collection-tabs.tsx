import Link from "next/link";
import { cn } from "@/lib/utils";

type Tab = "all" | "fav";

type Props = {
  active: Tab;
  favCount: number;
};

const tabs: ReadonlyArray<
  | { key: Tab; label: string; enabled: true; href: string }
  | { key: "recent" | "cat"; label: string; enabled: false }
> = [
  { key: "all", label: "Усі", enabled: true, href: "/account" },
  { key: "fav", label: "Обрані", enabled: true, href: "/account?tab=fav" },
  { key: "recent", label: "Останні", enabled: false },
  { key: "cat", label: "За категорією", enabled: false },
];

export function CollectionTabs({ active, favCount }: Props) {
  return (
    <div className="flex gap-1 border-b border-border/60">
      {tabs.map((tab) => {
        const isActive = tab.enabled && tab.key === active;
        const label =
          tab.key === "fav" && favCount > 0 ? `${tab.label} · ${favCount}` : tab.label;
        const classes = cn(
          "relative px-5 py-3 text-[14px]",
          isActive
            ? "font-semibold text-primary"
            : tab.enabled
              ? "text-muted-foreground hover:text-foreground"
              : "cursor-not-allowed text-muted-foreground/70",
        );

        if (tab.enabled) {
          return (
            <Link
              key={tab.key}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={classes}
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              {label}
              {isActive && (
                <span className="absolute inset-x-0 bottom-[-1px] h-0.5 bg-primary" />
              )}
            </Link>
          );
        }

        return (
          <span
            key={tab.key}
            title="скоро"
            className={classes}
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}
