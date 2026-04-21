import Image from "next/image";

export function AlreadyCrackedEmpty() {
  return (
    <div className="flex max-w-md flex-col items-center gap-5 text-center animate-fortune-reveal">
      <div className="relative size-30 overflow-hidden rounded-full opacity-70 shadow-[0_8px_24px_-4px_rgba(255,92,0,0.25)]">
        <Image
          src="/cookie/cookie.png"
          alt=""
          fill
          sizes="120px"
          className="object-cover"
        />
      </div>
      <p
        className="text-[12px] font-medium uppercase tracking-[0.24em] text-muted-foreground"
        style={{ fontFamily: "var(--font-funnel-sans)" }}
      >
        сьогоднішнє вже було
      </p>
      <p
        className="text-[22px] leading-snug text-foreground"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Ти вже розламав печиво сьогодні. Передбачення видалено, але одне печиво на день — і крапка.
      </p>
      <p className="text-[14px] text-muted-foreground">
        Повертайся завтра за новою мудрістю.
      </p>
    </div>
  );
}
