// src/app/dashboard/chamados/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

// Busca todos os chamados.
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

// Atualiza o status do chamado
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

// Exclui um chamado com trava de segurança
export async function deleteTicket(id: string) {
  const supabase = await createClient();

  const { data: ticket } = await supabase
    .from("tickets")
    .select("status")
    .eq("id", id)
    .single();

  if (ticket?.status === "RESOLVED") {
    return { error: "Não é possível excluir um chamado já concluído." };
  }

  const { error } = await supabase.from("tickets").delete().eq("id", id);

  if (!error) revalidatePath("/dashboard/chamados");
}

// Atualiza dados de um chamado existente
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

// Busca um chamado específico
export async function getTicketById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tickets")
    .select(
      `
      *,
      companies ( name ),
      equipments ( identification_number, type, remote_access_id, remote_access_type )
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

// Busca comentários da linha do tempo
// Busca comentários da linha do tempo COM O NOME DO USUÁRIO
// src/app/dashboard/chamados/actions.ts

export async function getTicketComments(ticketId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ticket_comments")
    .select(
      `
      *,
      profiles ( full_name )
    `,
    )
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Erro na busca dos comentários:", error.message);
    return [];
  }

  return data;
}

// Adiciona comentário com upload de evidência e REGISTRA QUEM FEZ
export async function addTicketComment(ticketId: string, formData: FormData) {
  const supabase = await createClient();

  // 1. Identifica o usuário logado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const content = formData.get("content") as string;
  const file = formData.get("file") as File | null;

  let file_url = null;
  let file_type = null;
  let file_name = null;

  if (file && file.size > 0 && file.name !== "undefined") {
    const fileExt = file.name.split(".").pop();
    const uniqueFileName = `${ticketId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("evidencias")
      .upload(uniqueFileName, file);

    if (uploadError) {
      console.error("Erro no upload:", uploadError);
      return { error: "Falha ao fazer upload da evidência." };
    }

    const { data: publicUrlData } = supabase.storage
      .from("evidencias")
      .getPublicUrl(uniqueFileName);

    file_url = publicUrlData.publicUrl;
    file_type = file.type;
    file_name = file.name;
  }

  // 2. Salva o comentário com o 'created_by'
  const { error } = await supabase.from("ticket_comments").insert([
    {
      ticket_id: ticketId,
      content,
      file_url,
      file_type,
      file_name,
      created_by: user?.id, // <-- Vincula o perfil aqui
    },
  ]);

  if (error) {
    console.error("Erro ao salvar comentário:", error);
    return { error: "Não foi possível salvar o comentário." };
  }

  revalidatePath(`/dashboard/chamados/${ticketId}`);
}

// ============================================================================
// NOVAS FUNÇÕES: GESTÃO DE SERVIÇOS E PEÇAS (TICKET ITEMS)
// ============================================================================

// Busca itens (serviços e peças) de um chamado específico
export async function getTicketItems(ticketId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ticket_items")
    .select("*")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Erro ao buscar itens do chamado:", error);
    return [];
  }
  return data;
}

// Inserir um novo item (Peça ou Serviço)
export async function addTicketItem(formData: FormData) {
  const supabase = await createClient();

  const ticketId = formData.get("ticket_id") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as "PRODUCT" | "SERVICE";
  const quantity = parseInt(formData.get("quantity") as string) || 1;
  const unitValue = parseFloat(formData.get("unit_value") as string) || 0.0;

  const { error } = await supabase.from("ticket_items").insert([
    {
      ticket_id: ticketId,
      description,
      type,
      quantity,
      unit_value: unitValue,
    },
  ]);

  if (error) {
    console.error("Erro ao adicionar item:", error);
    throw new Error("Não foi possível adicionar o item.");
  }

  revalidatePath(`/dashboard/chamados/${ticketId}`);
}

// Remover um item
export async function deleteTicketItem(itemId: string, ticketId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("ticket_items")
    .delete()
    .eq("id", itemId);

  if (error) {
    console.error("Erro ao deletar item:", error);
    throw new Error("Não foi possível remover o item.");
  }

  revalidatePath(`/dashboard/chamados/${ticketId}`);
}

// Adicione esta função ao final do seu src/app/dashboard/chamados/actions.ts

// Atualizar um item existente (Peça ou Serviço)
export async function updateTicketItem(formData: FormData) {
  const supabase = await createClient();

  const itemId = formData.get("item_id") as string;
  const ticketId = formData.get("ticket_id") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as "PRODUCT" | "SERVICE";
  const quantity = parseInt(formData.get("quantity") as string) || 1;
  const unitValue = parseFloat(formData.get("unit_value") as string) || 0.0;

  const { error } = await supabase
    .from("ticket_items")
    .update({
      description,
      type,
      quantity,
      unit_value: unitValue,
    })
    .eq("id", itemId);

  if (error) {
    console.error("Erro ao atualizar item:", error);
    throw new Error("Não foi possível atualizar o item.");
  }

  revalidatePath(`/dashboard/chamados/${ticketId}`);
}
