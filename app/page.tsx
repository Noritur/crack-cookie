import { redirect } from "next/navigation";
import { Cookie } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/auth/logo";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const fullName =
    (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-background px-6">
      <Logo />
      <div className="flex max-w-md flex-col items-center gap-3 text-center">
        <Cookie className="size-14 text-primary" strokeWidth={1.5} />
        <h1
          className="text-[32px] font-bold leading-tight text-foreground"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          You&apos;re in, {fullName}
        </h1>
        <p className="text-[15px] text-muted-foreground">
          The fortune-cracking experience is being prepared. Come back soon.
        </p>
      </div>
      <form action="/auth/signout" method="POST">
        <Button
          type="submit"
          variant="outline"
          className="h-10 rounded-full px-6"
        >
          Sign out
        </Button>
      </form>
    </div>
  );
}
