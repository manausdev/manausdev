import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ManausDev — Ecossistema de Tecnologia do Amazonas',
    short_name: 'ManausDev',
    description:
      'Quem constrói tecnologia e inovação sustentável em Manaus está conectado aqui. Desenvolvedores, projetos, vagas e comunidades.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0c2233',
    theme_color: '#0c2233',
    lang: 'pt-BR',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
