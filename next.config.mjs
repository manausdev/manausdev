/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/canais',
        destination: '/comunidades',
        permanent: true,
      },
      {
        // O dominio de producao e manausdev.com.br; ninguem deve iniciar sessao
        // (nem o fluxo OAuth/PKCE) no alias manausdev.vercel.app.
        source: '/:path*',
        has: [{ type: 'host', value: 'manausdev.vercel.app' }],
        destination: 'https://manausdev.com.br/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
