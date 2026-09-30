/** @type {import('next').NextConfig} */
const nextConfig = {
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
