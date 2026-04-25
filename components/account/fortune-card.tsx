"use client";

import { useOptimistic, useState, useTransition } from "react";
import { Share2, Star, Trash2, Sparkles } from "lucide-react";
import { deleteFortune, toggleFavorite } from "@/app/account/actions";
import { Button } from "@/components/ui/button";
import { encodeShareToken } from "@/lib/share";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  text: string;
  createdAt: string;
  isFavorite: boolean;
  featured?: boolean;
};

const MONTHS_UA = [
  "січ", "лют", "бер", "квіт", "трав", "черв",
  "лип", "серп", "вер", "жовт", "лист", "груд",
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS_UA[d.getMonth()]} ${d.getFullYear()}`;
}

export function FortuneCard({
  id,
  text,
  createdAt,
  isFavorite,
  featured = false,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [shareNote, setShareNote] = useState<string | null>(null);
  const [optimisticFav, setOptimisticFav] = useOptimistic(isFavorite);

  function onShare() {
    const url = `${window.location.origin}/share/${encodeShareToken(text)}`;
    const payload = `«${text}»`;
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ text: payload, url }).catch(() => {});
      return;
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`${payload}\n${url}`).then(
        () => {
          setShareNote("скопійовано");
          setTimeout(() => setShareNote(null), 1500);
        },
        () => setShareNote("не вдалося")
      );
    }
  }

  function onDelete() {
    if (!confirm("Видалити цю фортуну з колекції?")) return;
    startTransition(async () => {
      await deleteFortune(id);
    });
  }

  function onToggleFavorite() {
    startTransition(async () => {
      setOptimisticFav(!optimisticFav);
      await toggleFavorite(id);
    });
  }

  return (
    <article
      className={cn(
        "group/fortunecard relative flex flex-col overflow-hidden rounded-xl transition-opacity",
        featured
          ? "bg-gradient-to-br from-[#FF5C00] via-[#FF8533] to-[#FFB380] text-primary-foreground"
          : "bg-card ring-1 ring-border shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
        isPending && "opacity-50"
      )}
    >
      {!featured && (
        <span
          aria-hidden
          className="block h-1.5 w-full bg-gradient-to-r from-[#FF5C00] via-[#FF8533] to-[#FFB380]"
        />
      )}
      <div className="flex flex-col gap-3.5 p-6">
        {featured && (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold">
            <Sparkles className="size-3" /> Передбачення дня
          </span>
        )}
        <p
          className={cn(
            "text-[16px] leading-relaxed",
            featured ? "text-white text-[18px] font-medium" : "text-foreground"
          )}
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          «{text}»
        </p>
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "text-[12px]",
              featured ? "text-white/80" : "text-muted-foreground"
            )}
            style={{ fontFamily: "var(--font-funnel-sans)" }}
          >
            {formatDate(createdAt)}
          </span>
          <div className="flex items-center gap-1">
            {shareNote && (
              <span
                className={cn(
                  "mr-1 text-[11px]",
                  featured ? "text-white/90" : "text-muted-foreground"
                )}
              >
                {shareNote}
              </span>
            )}
            <Button
              type="button"
              onClick={onToggleFavorite}
              disabled={isPending}
              variant="ghost"
              size="icon-sm"
              aria-label={optimisticFav ? "Прибрати з обраних" : "Додати в обрані"}
              aria-pressed={optimisticFav}
              className={cn(
                "rounded-full",
                featured
                  ? "text-white hover:bg-white/20 hover:text-white"
                  : optimisticFav
                    ? "text-primary hover:text-primary"
                    : "hover:text-primary",
              )}
            >
              <Star
                className={cn(
                  "size-4",
                  optimisticFav && (featured ? "fill-white" : "fill-primary"),
                )}
              />
            </Button>
            <Button
              type="button"
              onClick={onShare}
              variant="ghost"
              size="icon-sm"
              aria-label="Поділитися"
              className={cn(
                "rounded-full",
                featured && "text-white hover:bg-white/20 hover:text-white"
              )}
            >
              <Share2 className="size-4" />
            </Button>
            <Button
              type="button"
              onClick={onDelete}
              disabled={isPending}
              variant="ghost"
              size="icon-sm"
              aria-label="Видалити"
              className={cn(
                "rounded-full",
                featured
                  ? "text-white hover:bg-white/20 hover:text-white"
                  : "hover:text-destructive"
              )}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
