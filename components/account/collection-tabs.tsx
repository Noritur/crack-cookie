import { cn } from "@/lib/utils";

const tabs = [
  { key: "all", label: "Усі", active: true },
  { key: "fav", label: "Обрані", active: false },
  { key: "recent", label: "Останні", active: false },
  { key: "cat", label: "За категорією", active: false },
] as const;

export function CollectionTabs() {
  return (
    <div className="flex gap-1 border-b border-border/60">
      {tabs.map((tab) => (
        <div
          key={tab.key}
          aria-current={tab.active ? "page" : undefined}
          title={tab.active ? undefined : "скоро"}
          className={cn(
            "relative px-5 py-3 text-[14px]",
            tab.active
              ? "font-semibold text-primary"
              : "text-muted-foreground/70 cursor-not-allowed"
          )}
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          {tab.label}
          {tab.active && (
            <span className="absolute inset-x-0 bottom-[-1px] h-0.5 bg-primary" />
          )}
        </div>
      ))}
    </div>
  );
}
