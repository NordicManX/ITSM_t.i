// src/app/dashboard/equipamentos/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

// Busca equipamentos juntamente com o nome da empresa
// 1. Atualize a sua getEquipments para buscar também o relacionamento com 'sectors'
export async function getEquipments() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("equipments")
    .select(
      `
      *,
      companies ( name ),
      sectors ( name )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar equipamentos:", error);
    return [];
  }
  return data;
}

// 2. Adicione a action para buscar todos os setores do banco
export async function getSectors() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sectors")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Erro ao buscar setores:", error);
    return [];
  }
  return data;
}

// 3. Adicione a action para criar um novo setor
export async function createSector(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const company_id = formData.get("company_id") as string;

  const { error } = await supabase
    .from("sectors")
    .insert([{ name, company_id }]);

  if (error) {
    console.error("Erro ao criar setor:", error);
    return { error: "Não foi possível criar o setor." };
  }

  revalidatePath("/dashboard/equipamentos");
}

// 4. Adicione a action para deletar um setor
export async function deleteSector(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("sectors").delete().eq("id", id);

  if (error) {
    console.error("Erro ao deletar setor:", error);
    return { error: "Não foi possível excluir o setor." };
  }

  revalidatePath("/dashboard/equipamentos");
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

// Cria um novo equipamento
export async function createEquipment(formData: FormData) {
  const supabase = await createClient();

  const type = formData.get("type") as string;
  const identification_number = formData.get("identification_number") as string;
  const company_id = formData.get("company_id") as string;
  const description = formData.get("description") as string;

  // Capturando os novos campos
  const remote_access_type = formData.get("remote_access_type") as string;
  const remote_access_id = formData.get("remote_access_id") as string;
  const sector_id = formData.get("sector_id") as string; // <-- NOVO: Captura o setor

  const { error } = await supabase.from("equipments").insert([
    {
      type,
      identification_number,
      company_id,
      description: description || null,
      remote_access_type: remote_access_type || "ANYDESK",
      remote_access_id: remote_access_id || null,
      sector_id: sector_id === "" ? null : sector_id, // <-- NOVO: Salva o setor
    },
  ]);

  if (error) {
    console.error("Erro ao criar equipamento:", error);
    return { error: "Não foi possível cadastrar o equipamento." };
  }

  revalidatePath("/dashboard/equipamentos");
}

// Atualiza um equipamento existente
export async function updateEquipment(id: string, formData: FormData) {
  const supabase = await createClient();

  const company_id = formData.get("company_id") as string;
  const type = formData.get("type") as string;
  const identification_number = formData.get("identification_number") as string;
  const description = formData.get("description") as string;

  // Capturando os novos campos
  const remote_access_type = formData.get("remote_access_type") as string;
  const remote_access_id = formData.get("remote_access_id") as string;
  const sector_id = formData.get("sector_id") as string; // <-- NOVO: Captura o setor

  const { error } = await supabase
    .from("equipments")
    .update({
      company_id,
      type,
      identification_number,
      description: description || null,
      remote_access_type: remote_access_type || "ANYDESK",
      remote_access_id: remote_access_id || null,
      sector_id: sector_id === "" ? null : sector_id, // <-- NOVO: Atualiza o setor
    })
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
