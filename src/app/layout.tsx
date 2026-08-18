import type { Metadata } from 'next';
import { Inter, Montserrat, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ManausDev — Quem constrói tecnologia em Manaus está aqui',
  description: 'Comunidade aberta e ecossistema de tecnologia, desenvolvedores, vagas e projetos no Amazonas.',
  keywords: ['Manaus', 'Amazonas', 'Desenvolvedores', 'Tech', 'Next.js', 'Supabase', 'Projetos', 'Vagas'],
  authors: [{ name: 'ManausDev Community' }],
  openGraph: {
    title: 'ManausDev — Ecossistema Tech de Manaus',
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
    <html lang="pt-BR" className={`${inter.variable} ${montserrat.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#070A12] text-slate-100 antialiased selection:bg-[#00F5FF]/30 selection:text-[#00F5FF]">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
