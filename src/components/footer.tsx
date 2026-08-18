import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#070A12] text-slate-400 text-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Coluna 1: Sobre & Badge */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl">🌿</span>
              <span className="font-display font-extrabold text-lg text-white">
                Manaus<span className="text-[#00F5FF]">Dev</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              O ecossistema que conecta desenvolvedores, comunidades, empresas e projetos tecnológicos no Amazonas.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[11px] font-mono font-medium">
              <span>🍃</span> Feito em Manaus • 100% Regional
            </div>
          </div>

          {/* Coluna 2: Diretórios */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Explorar</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/devs" className="hover:text-[#00F5FF] transition-colors">Desenvolvedores</Link></li>
              <li><Link href="/projetos" className="hover:text-[#00F5FF] transition-colors">Projetos Tech</Link></li>
              <li><Link href="/vagas" className="hover:text-[#00F5FF] transition-colors">Oportunidades & Vagas</Link></li>
              <li><Link href="/empresas" className="hover:text-[#00F5FF] transition-colors">Empresas & Polos</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Comunidade */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Comunidade</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/comunidades" className="hover:text-[#00F5FF] transition-colors">Grupos & Meetups</Link></li>
              <li><Link href="/eventos" className="hover:text-[#00F5FF] transition-colors">Calendário de Eventos</Link></li>
              <li><Link href="/sobre" className="hover:text-[#00F5FF] transition-colors">Sobre a Iniciativa</Link></li>
              <li><Link href="/contato" className="hover:text-[#00F5FF] transition-colors">Fale Conosco</Link></li>
            </ul>
          </div>

          {/* Coluna 4: Legal & Open Source */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Transparência</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/termos" className="hover:text-[#00F5FF] transition-colors">Termos de Uso</Link></li>
              <li><Link href="/privacidade" className="hover:text-[#00F5FF] transition-colors">Privacidade de Dados</Link></li>
              <li><a href="https://github.com/manausdev" target="_blank" rel="noreferrer" className="hover:text-[#00F5FF] transition-colors">GitHub ManausDev</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ManausDev Community. Licenciado sob Apache-2.0.</p>
          <p className="flex items-center gap-1">
            Desenvolvido com Next.js, Tailwind CSS & Supabase ⚡
          </p>
        </div>
      </div>
    </footer>
  );
}
