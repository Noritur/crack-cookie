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
