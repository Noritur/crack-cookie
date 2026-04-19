import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/auth/logo";
import { SidePanel } from "@/components/auth/side-panel";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default async function ForgotPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/");

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[minmax(0,1.22fr)_minmax(0,1fr)]">
      <div className="flex items-center justify-center bg-background px-6 py-10 lg:px-20 lg:py-16">
        <div className="flex w-full max-w-[380px] flex-col gap-7">
          <Logo />
          <div className="flex flex-col gap-1.5">
            <h1
              className="text-[32px] font-bold leading-tight text-foreground"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Забув пароль?
            </h1>
            <p className="text-[15px] text-muted-foreground">
              Введи свій email — скинемо туди посилання для відновлення
            </p>
          </div>
          <ForgotPasswordForm />
        </div>
      </div>
      <SidePanel quote={`"Не всі, хто блукає, загубилися — але їхні паролі часто так"`} />
    </div>
  );
}
