"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function deleteFortune(id: string): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("delete_fortune", { p_id: id });

  if (error) {
    console.error("delete_fortune rpc error:", error);
    return { ok: false };
  }

  revalidatePath("/account");
  revalidatePath("/");
  return { ok: Boolean(data) };
}

export async function toggleFavorite(
  id: string,
): Promise<{ ok: true; isFavorite: boolean } | { ok: false }> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("toggle_favorite", { p_id: id });

  if (error) {
    console.error("toggle_favorite rpc error:", error);
    return { ok: false };
  }

  revalidatePath("/account");
  return { ok: true, isFavorite: Boolean(data) };
}
