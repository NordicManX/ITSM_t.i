// src/app/dashboard/empresas/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

// Busca todas as empresas cadastradas no banco
export async function getCompanies() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar empresas:", error);
    return [];
  }
  return data;
}

// Cria uma nova empresa a partir do formulário
export async function createCompany(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const cnpj = formData.get("cnpj") as string;

  const { error } = await supabase.from("companies").insert([{ name, cnpj }]);

  if (error) {
    console.error("Erro ao criar empresa:", error);
    return { error: "Não foi possível cadastrar a empresa." };
  }

  // Avisa o Next.js para atualizar os dados da tela de empresas
  revalidatePath("/dashboard/empresas");
}
