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
    ];
  },
};

export default nextConfig;
