// src/app/manifest.ts
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NordicDesk TI',
    short_name: 'NordicDesk',
    description: 'NordicDesk TI é um sistema de gestão de infraestrutura de TI, permitindo o gerenciamento de empresas, clientes, contratos, equipamentos e anotações de forma eficiente e segura.',
    start_url: '/dashboard', // Define onde o app vai abrir ao ser clicado
    display: 'standalone', // Faz o app abrir em janela própria, sem a barra do navegador
    background_color: '#030712', // Cor de fundo (bg-gray-950)
    theme_color: '#030712', // Cor da barra superior da janela
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}