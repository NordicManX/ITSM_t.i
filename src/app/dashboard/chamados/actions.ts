// src/app/dashboard/chamados/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

// Busca todos os chamados com os dados da empresa e equipamento anexados
export async function getTickets() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tickets")
    .select(
      `
      *,
      companies ( name ),
      equipments ( identification_number, type )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar chamados:", error);
    return [];
  }
  return data;
}

// Cria um novo chamado
export async function createTicket(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string;
  const company_id = formData.get("company_id") as string;
  const equipment_id = (formData.get("equipment_id") as string) || null;

  const { error } = await supabase.from("tickets").insert([
    {
      title,
      description,
      priority,
      company_id,
      equipment_id: equipment_id === "" ? null : equipment_id,
    },
  ]);

  if (error) {
    console.error("Erro ao criar chamado:", error);
    return { error: "Não foi possível criar o chamado." };
  }

  revalidatePath("/dashboard/chamados");
}

// Atualiza apenas o status (Usaremos isso para mover os cards no Kanban)
export async function updateTicketStatus(id: string, newStatus: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("tickets")
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Erro ao atualizar status do chamado:", error);
    return { error: "Não foi possível atualizar o chamado." };
  }

  revalidatePath("/dashboard/chamados");
}

// Exclui um chamado
export async function deleteTicket(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("tickets").delete().eq("id", id);

  if (error) {
    console.error("Erro ao excluir chamado:", error);
    return { error: "Não foi possível excluir o chamado." };
  }

  revalidatePath("/dashboard/chamados");
}

// src/app/dashboard/chamados/actions.ts (Adicione no final)

// Atualiza os dados de um chamado existente
export async function updateTicket(id: string, formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string;
  const company_id = formData.get("company_id") as string;
  const equipment_id = (formData.get("equipment_id") as string) || null;

  const { error } = await supabase
    .from("tickets")
    .update({
      title,
      description,
      priority,
      company_id,
      equipment_id: equipment_id === "" ? null : equipment_id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Erro ao atualizar chamado:", error);
    return { error: "Não foi possível atualizar o chamado." };
  }

  revalidatePath("/dashboard/chamados");
}

// src/app/dashboard/chamados/actions.ts (Adicione no final)

// Busca um chamado específico pelo ID
export async function getTicketById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tickets")
    .select(
      `
      *,
      companies ( name ),
      equipments ( identification_number, type )
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erro ao buscar chamado:", error);
    return null;
  }
  return data;
}

// Busca a linha do tempo (comentários) do chamado
export async function getTicketComments(ticketId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ticket_comments")
    .select("*")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true }); // Do mais antigo para o mais novo

  if (error) return [];
  return data;
}

export async function addTicketComment(ticketId: string, formData: FormData) {
  const supabase = await createClient();
  const content = formData.get("content") as string;
  const file = formData.get("file") as File | null;

  let file_url = null;
  let file_type = null;
  let file_name = null;

  // Se veio um arquivo real do formulário
  if (file && file.size > 0 && file.name !== "undefined") {
    const fileExt = file.name.split(".").pop();
    const uniqueFileName = `${ticketId}-${Date.now()}.${fileExt}`;

    // Faz o upload direto pro Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("evidencias")
      .upload(uniqueFileName, file);

    if (uploadError) {
      console.error("Erro no upload:", uploadError);
      return { error: "Falha ao fazer upload da evidência." };
    }

    // Pega o link público da imagem/vídeo
    const { data: publicUrlData } = supabase.storage
      .from("evidencias")
      .getPublicUrl(uniqueFileName);

    file_url = publicUrlData.publicUrl;
    file_type = file.type;
    file_name = file.name;
  }

  // Salva o comentário com o texto e o link do anexo (se houver)
  const { error } = await supabase.from("ticket_comments").insert([
    {
      ticket_id: ticketId,
      content,
      file_url,
      file_type,
      file_name,
    },
  ]);

  if (error) {
    console.error("Erro ao salvar comentário:", error);
    return { error: "Não foi possível salvar o comentário." };
  }

  // AQUI FOI CORRIGIDO: Removi o import que estava no lugar errado
  revalidatePath(`/dashboard/chamados/${ticketId}`);
}
