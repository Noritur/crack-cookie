import Link from "next/link";
import { Logo } from "@/components/auth/logo";
import { buttonVariants } from "@/components/ui/button";

export function PublicNav() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur-md md:px-12">
      <Link href="/" aria-label="FortuneCrack home" className="inline-flex">
        <Logo />
      </Link>
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="text-[14px] text-muted-foreground transition-colors hover:text-foreground"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          Увійти
        </Link>
        <a
          href="#start"
          className={`${buttonVariants({ variant: "default", size: "sm" })} rounded-full h-9 px-5`}
        >
          Спробувати
        </a>
      </div>
    </header>
  );
}
