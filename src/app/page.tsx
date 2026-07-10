// src/app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  // Redireciona o usuário para a tela de login assim que ele acessar o site
  redirect('/login');
}