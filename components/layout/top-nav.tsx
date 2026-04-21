import Link from "next/link";
import { Library, User } from "lucide-react";
import { Logo } from "@/components/auth/logo";
import { Button, buttonVariants } from "@/components/ui/button";

export function TopNav({ activeHref }: { activeHref?: string }) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur-md md:px-12">
      <Link href="/" aria-label="FortuneCrack home" className="inline-flex">
        <Logo />
      </Link>
      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-1 md:flex">
          {activeHref !== "/account" && (
            <Link
              href="/account"
              aria-label="Колекція"
              className={buttonVariants({ variant: "ghost", size: "icon" })}
            >
              <Library className="size-5" />
            </Link>
          )}
          {activeHref !== "/profile" && (
            <Link
              href="/profile"
              aria-label="Профіль"
              className={buttonVariants({ variant: "ghost", size: "icon" })}
            >
              <User className="size-5" />
            </Link>
          )}
        </div>
        <form action="/auth/signout" method="POST">
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="h-9 rounded-full px-4"
          >
            Вийти
          </Button>
        </form>
      </div>
    </header>
  );
}
