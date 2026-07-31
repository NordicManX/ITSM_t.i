// src/app/dashboard/anotacoes/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// 1. Busca as anotações com Filtro de Segurança por Perfil
export async function getNotes() {
  const supabase = await createClient();

  // A. Descobre quem é o usuário logado
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  // B. Busca o perfil para saber a role e a company_id
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, company_id")
    .eq("id", user.id)
    .single();

  // C. Monta a busca básica
  let query = supabase
    .from("notes")
    .select(
      `
      *,
      companies ( name ),
      profiles ( full_name )
    `,
    )
    .order("created_at", { ascending: false });

  // D. Filtro de Privacidade
  // Se o usuário NÃO for da sua equipe de TI (ADMIN)...
  if (profile?.role !== "ADMIN") {
    // Trava a busca para trazer APENAS as anotações da empresa dele.
    query = query.eq("company_id", profile?.company_id);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erro ao buscar anotações:", error);
    return [];
  }

  return data;
}

// 2. Cria uma nova anotação
export async function createNote(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const company_id = formData.get("company_id") as string;

  const { error } = await supabase.from("notes").insert([
    {
      title,
      content,
      category: category || "GERAL",
      company_id: company_id === "" ? null : company_id,
      created_by: user?.id,
    },
  ]);

  if (error) {
    console.error("Erro ao criar anotação:", error);
    return { error: "Não foi possível criar a anotação." };
  }

  revalidatePath("/dashboard/anotacoes");
}

// 3. Exclui uma anotação
export async function deleteNote(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("notes").delete().eq("id", id);

  if (error) {
    console.error("Erro ao deletar anotação:", error);
    return { error: "Erro ao deletar anotação" };
  }

  revalidatePath("/dashboard/anotacoes");
}

// 4. Atualiza uma anotação existente
export async function updateNote(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const company_id = formData.get("company_id") as string;

  const { error } = await supabase
    .from("notes")
    .update({
      title,
      content,
      category: category || "GERAL",
      company_id: company_id === "" ? null : company_id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Erro ao atualizar anotação:", error);
    return { error: "Não foi possível atualizar a anotação." };
  }

  revalidatePath("/dashboard/anotacoes");
}

// 5. Valida a senha do usuário atual (para desbloquear anotações)
export async function verifyUserPassword(password: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return false;

  // Tenta autenticar novamente para confirmar se a senha está correta
  const { error } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: password,
  });

  return !error; // Retorna true se não houver erro (senha correta)
}
