// src/app/dashboard/equipamentos/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

// Busca equipamentos juntamente com o nome da empresa
export async function getEquipments() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("equipments")
    .select("*, companies(name)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar equipamentos:", error);
    return [];
  }
  return data;
}

// Busca apenas empresas para preencher o campo <select> do formulário
export async function getCompaniesList() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("companies")
    .select("id, name")
    .order("name", { ascending: true });

  return data || [];
}

// Cria um novo equipamento
// Exemplo de como deve ficar a gravação na sua action de criação/edição:

export async function createEquipment(formData: FormData) {
  const supabase = await createClient();

  const type = formData.get("type") as string;
  const identification_number = formData.get("identification_number") as string;
  const company_id = formData.get("company_id") as string;

  // Capturando os novos campos de acesso remoto
  const remote_access_type = formData.get("remote_access_type") as string;
  const remote_access_id = formData.get("remote_access_id") as string;

  const { error } = await supabase.from("equipments").insert([
    {
      type,
      identification_number,
      company_id,
      remote_access_type: remote_access_type || "ANYDESK",
      remote_access_id: remote_access_id || null,
    },
  ]);

  if (error) {
    console.error("Erro ao criar equipamento:", error);
    return { error: "Não foi possível cadastrar o equipamento." };
  }

  revalidatePath("/dashboard/equipamentos");
}

// Adicione no final de src/app/dashboard/equipamentos/actions.ts

// Atualiza um equipamento existente
export async function updateEquipment(id: string, formData: FormData) {
  const supabase = await createClient();

  const company_id = formData.get("company_id") as string;
  const type = formData.get("type") as string;
  const identification_number = formData.get("identification_number") as string;
  const description = formData.get("description") as string;

  const { error } = await supabase
    .from("equipments")
    .update({ company_id, type, identification_number, description })
    .eq("id", id);

  if (error) {
    console.error("Erro ao atualizar equipamento:", error);
    return { error: "Não foi possível atualizar o equipamento." };
  }

  revalidatePath("/dashboard/equipamentos");
}

// Exclui um equipamento
export async function deleteEquipment(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("equipments").delete().eq("id", id);

  if (error) {
    console.error("Erro ao excluir equipamento:", error);
    return { error: "Não foi possível excluir o equipamento." };
  }

  revalidatePath("/dashboard/equipamentos");
}
