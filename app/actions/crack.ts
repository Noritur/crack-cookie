"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CrackedFortune = {
  id: string;
  fortune_text: string;
  crack_date: string;
  created_at: string;
};

type CrackResult =
  | { ok: true; fortune: CrackedFortune }
  | { ok: false; reason: "already_today" | "unauthenticated" | "empty_catalog" | "unknown" };

export async function crackFortune(): Promise<CrackResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("crack_fortune");

  if (error) {
    if (error.code === "P0001") return { ok: false, reason: "already_today" };
    if (error.code === "42501") return { ok: false, reason: "unauthenticated" };
    if (error.code === "P0002") return { ok: false, reason: "empty_catalog" };
    console.error("crack_fortune rpc error:", error);
    return { ok: false, reason: "unknown" };
  }

  revalidatePath("/");
  revalidatePath("/account");

  return {
    ok: true,
    fortune: {
      id: data.id,
      fortune_text: data.fortune_text,
      crack_date: data.crack_date,
      created_at: data.created_at,
    },
  };
}
