/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Remove o vazamento de tecnologia
  poweredByHeader: false, 

  // 2. Injeta os escudos de segurança em todas as rotas
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Proíbe que o sistema seja aberto em iframes de outros sites
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // Impede injeção de scripts disfarçados
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin', // Protege dados de navegação na URL
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains', // Força o uso estrito de HTTPS
          },
        ],
      },
    ];
  },
};

export default nextConfig; // ou module.exports = nextConfig; se for .js