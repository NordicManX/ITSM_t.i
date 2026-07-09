// src/app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function logout() {
  const supabase = await createClient()
  
  // Destrói a sessão no banco de dados e limpa os cookies
  await supabase.auth.signOut()
  
  // Limpa o cache do navegador para evitar que páginas antigas fiquem na memória
  revalidatePath('/', 'layout')
  
  // Redireciona o usuário para a porta de entrada
  redirect('/login')
}