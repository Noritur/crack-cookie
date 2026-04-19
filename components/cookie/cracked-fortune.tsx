import Link from "next/link";

type Props = {
  text: string;
};

export function CrackedFortune({ text }: Props) {
  return (
    <div className="flex max-w-xl flex-col items-center gap-7 text-center animate-fortune-reveal">
      <p
        className="text-[12px] font-medium uppercase tracking-[0.24em] text-muted-foreground"
        style={{ fontFamily: "var(--font-funnel-sans)" }}
      >
        твоє передбачення дня
      </p>
      <p
        className="text-[26px] font-medium leading-snug text-foreground md:text-[32px]"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        «{text}»
      </p>
      <p className="text-[14px] text-muted-foreground">
        Ти вже розламав печиво сьогодні. Повертайся завтра.
      </p>
      <Link
        href="/account"
        className="text-[14px] font-semibold text-primary underline-offset-4 hover:underline"
      >
        переглянути колекцію →
      </Link>
    </div>
  );
}
