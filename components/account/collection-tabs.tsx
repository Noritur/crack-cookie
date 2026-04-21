import Link from "next/link";
import { cn } from "@/lib/utils";

export type Tab = "all" | "fav" | "recent";

type Props = {
  active: Tab;
  favCount: number;
  q?: string;
};

const tabs: ReadonlyArray<{ key: Tab; label: string }> = [
  { key: "all", label: "Усі" },
  { key: "fav", label: "Обрані" },
  { key: "recent", label: "Останні" },
];

function buildHref(tab: Tab, q?: string): string {
  const params = new URLSearchParams();
  if (tab !== "all") params.set("tab", tab);
  if (q) params.set("q", q);
  const qs = params.toString();
  return qs ? `/account?${qs}` : "/account";
}

export function CollectionTabs({ active, favCount, q }: Props) {
  return (
    <div className="flex gap-1 border-b border-border/60">
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        const label =
          tab.key === "fav" && favCount > 0 ? `${tab.label} · ${favCount}` : tab.label;
        const classes = cn(
          "relative px-5 py-3 text-[14px]",
          isActive
            ? "font-semibold text-primary"
            : "text-muted-foreground hover:text-foreground",
        );

        return (
          <Link
            key={tab.key}
            href={buildHref(tab.key, q)}
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
      })}
    </div>
  );
}
