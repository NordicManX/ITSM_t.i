// src/app/dashboard/categorias/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categorias")
    .select("*")
    .order("created_at", { ascending: false });

  return data || [];
}

export async function addCategory(formData: FormData) {
  const supabase = await createClient();
  const nome = formData.get("nome") as string;
  const descricao = formData.get("descricao") as string;

  if (!nome) return;

  await supabase.from("categorias").insert([{ nome, descricao }]);
  revalidatePath("/dashboard/categorias");
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  await supabase.from("categorias").delete().eq("id", id);
  revalidatePath("/dashboard/categorias");
}

export async function toggleCategoryStatus(id: string, currentStatus: boolean) {
  const supabase = await createClient();
  await supabase
    .from("categorias")
    .update({ ativo: !currentStatus })
    .eq("id", id);
  revalidatePath("/dashboard/categorias");
}
