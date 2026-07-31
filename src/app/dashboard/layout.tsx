// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css"; // Exemplo do seu CSS global

// 1. Configuração da cor da janela/barra para Android e Desktop
export const viewport: Viewport = {
  themeColor: "#030712",
};

// 2. Configurações gerais e a "parada" do iOS (appleWebApp)
export const metadata: Metadata = {
  title: "NordicDesk TI",
  description: "Painel de Gestão de TI e Cofre de Anotações",
  appleWebApp: {
    capable: true,
    title: "NordicDesk",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-950 text-gray-50">
        {children}
      </body>
    </html>
  );
}