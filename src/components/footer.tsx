import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface text-muted text-sm">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Coluna 1: Sobre & Badge */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-brand text-on-neon font-mono text-sm font-bold">{'</>'}</span>
              <span className="font-display font-bold text-lg text-ink">
                Manaus<span className="text-accent-text">Dev</span>
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              O ecossistema que conecta desenvolvedores, comunidades, empresas e projetos tecnológicos sustentáveis no Amazonas.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent-text border border-accent/20 text-[11px] font-mono font-medium">
              <span>🍃</span> Feito em Manaus • 100% Regional
            </div>
          </div>

          {/* Coluna 2: Diretórios */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-ink">Explorar</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/devs" className="hover:text-accent-text transition-colors">Desenvolvedores</Link></li>
              <li><Link href="/projetos" className="hover:text-accent-text transition-colors">Projetos Tech & Bioeconomia</Link></li>
              <li><Link href="/vagas" className="hover:text-accent-text transition-colors">Oportunidades & Vagas</Link></li>
              <li><Link href="/empresas" className="hover:text-accent-text transition-colors">Empresas & Polos</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Comunidade */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-ink">Comunidade</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/comunidades" className="hover:text-accent-text transition-colors">Grupos & Meetups</Link></li>
              <li><Link href="/eventos" className="hover:text-accent-text transition-colors">Calendário de Eventos</Link></li>
              <li><Link href="/sobre" className="hover:text-accent-text transition-colors">Sobre a Iniciativa</Link></li>
              <li><Link href="/contato" className="hover:text-accent-text transition-colors">Fale Conosco</Link></li>
            </ul>
          </div>

          {/* Coluna 4: Transparência */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-ink">Transparência</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/termos" className="hover:text-accent-text transition-colors">Termos de Uso</Link></li>
              <li><Link href="/privacidade" className="hover:text-accent-text transition-colors">Privacidade (LGPD)</Link></li>
              <li><a href="https://github.com/manausdev" target="_blank" rel="noreferrer" className="hover:text-accent-text transition-colors">GitHub ManausDev</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-faint">
          <p>© {new Date().getFullYear()} ManausDev Community. Licença Apache-2.0.</p>
          <p className="flex items-center gap-1 font-medium">
            Next.js • Supabase • Green-Tech Design System 🌿
          </p>
        </div>
      </div>
    </footer>
  );
}
