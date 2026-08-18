import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-[#e0e3e5] bg-[#ffffff] text-[#404944] text-sm">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Coluna 1: Sobre & Badge */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl">🌿</span>
              <span className="font-display font-bold text-lg text-[#003527]">
                Manaus<span className="text-[#006c49]">Dev</span>
              </span>
            </div>
            <p className="text-xs text-[#404944] leading-relaxed">
              O ecossistema que conecta desenvolvedores, comunidades, empresas e projetos tecnológicos sustentáveis no Amazonas.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#006c49]/10 text-[#006c49] border border-[#006c49]/20 text-[11px] font-mono font-medium">
              <span>🍃</span> Feito em Manaus • 100% Regional
            </div>
          </div>

          {/* Coluna 2: Diretórios */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#003527]">Explorar</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/devs" className="hover:text-[#006c49] transition-colors">Desenvolvedores</Link></li>
              <li><Link href="/projetos" className="hover:text-[#006c49] transition-colors">Projetos Tech & Bioeconomia</Link></li>
              <li><Link href="/vagas" className="hover:text-[#006c49] transition-colors">Oportunidades & Vagas</Link></li>
              <li><Link href="/empresas" className="hover:text-[#006c49] transition-colors">Empresas & Polos</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Comunidade */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#003527]">Comunidade</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/comunidades" className="hover:text-[#006c49] transition-colors">Grupos & Meetups</Link></li>
              <li><Link href="/eventos" className="hover:text-[#006c49] transition-colors">Calendário de Eventos</Link></li>
              <li><Link href="/sobre" className="hover:text-[#006c49] transition-colors">Sobre a Iniciativa</Link></li>
              <li><Link href="/contato" className="hover:text-[#006c49] transition-colors">Fale Conosco</Link></li>
            </ul>
          </div>

          {/* Coluna 4: Transparência */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#003527]">Transparência</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/termos" className="hover:text-[#006c49] transition-colors">Termos de Uso</Link></li>
              <li><Link href="/privacidade" className="hover:text-[#006c49] transition-colors">Privacidade (LGPD)</Link></li>
              <li><a href="https://github.com/manausdev" target="_blank" rel="noreferrer" className="hover:text-[#006c49] transition-colors">GitHub ManausDev</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#e0e3e5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#707974]">
          <p>© {new Date().getFullYear()} ManausDev Community. Licença Apache-2.0.</p>
          <p className="flex items-center gap-1 font-medium">
            Next.js • Supabase • Green-Tech Design System 🌿
          </p>
        </div>
      </div>
    </footer>
  );
}
