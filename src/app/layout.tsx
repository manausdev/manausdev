import type { Metadata } from 'next';
import { Inter, Sora, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { CookieConsent } from '@/components/cookie-consent';

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
  title: 'ManausDev — Ecossistema de Tecnologia do Amazonas',
  description: 'Quem constrói tecnologia e inovação sustentável em Manaus está conectado aqui. Desenvolvedores, projetos, vagas e comunidades.',
  keywords: ['Manaus', 'Amazonas', 'Desenvolvedores', 'Tech', 'Next.js', 'Supabase', 'Projetos', 'Vagas', 'GreenTech'],
  authors: [{ name: 'ManausDev Community' }],
  openGraph: {
    title: 'ManausDev — Ecossistema de Tecnologia do Amazonas',
    description: 'Quem constrói tecnologia em Manaus está aqui.',
    type: 'website',
    locale: 'pt_BR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${sora.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#f7f9fb] text-[#191c1e] antialiased selection:bg-[#6cf8bb] selection:text-[#003527]">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
