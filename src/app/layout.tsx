import type { Metadata } from 'next';
import { Inter, Sora, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header, Footer, CookieConsent, themeInitScript } from '@/organisms';
import { SITE_URL } from '@/lib/site';
import styles from './layout.module.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'ManausDev — Ecossistema de Tecnologia do Amazonas',
  description: 'Quem constrói tecnologia e inovação sustentável em Manaus está conectado aqui. Desenvolvedores, projetos, vagas e comunidades.',
  keywords: ['Manaus', 'Amazonas', 'Desenvolvedores', 'Tech', 'Next.js', 'Supabase', 'Projetos', 'Vagas', 'GreenTech'],
  authors: [{ name: 'ManausDev Community' }],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ManausDev — Ecossistema de Tecnologia do Amazonas',
    description: 'Quem constrói tecnologia em Manaus está aqui.',
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: 'ManausDev',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ManausDev — Ecossistema de Tecnologia do Amazonas',
    description: 'Quem constrói tecnologia em Manaus está aqui.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${inter.variable} ${sora.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: `if ('serviceWorker' in navigator) { window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js')); }` }} />
      </head>
      <body className={styles.body}>
        <Header />
        <main className={styles.main}>
          {children}
        </main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}