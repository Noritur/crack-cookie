"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type MagicLinkResult =
  | { ok: true; email: string }
  | { ok: false; reason: "invalid_email" | "rate_limited" | "unknown" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function requestMagicLink(
  _prev: MagicLinkResult | null,
  formData: FormData,
): Promise<MagicLinkResult> {
  const raw = formData.get("email");
  const email = typeof raw === "string" ? raw.trim().toLowerCase() : "";

  if (!EMAIL_RE.test(email)) {
    return { ok: false, reason: "invalid_email" };
  }

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  const origin = host ? `${proto}://${host}` : "";

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${origin}/auth/callback?next=/`,
    },
  });

  if (error) {
    if (error.status === 429) return { ok: false, reason: "rate_limited" };
    console.error("signInWithOtp error:", error);
    return { ok: false, reason: "unknown" };
  }

  return { ok: true, email };
}
