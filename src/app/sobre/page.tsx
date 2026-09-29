import { Sparkles, Shield, Heart, Compass } from 'lucide-react';

export default function SobrePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent-text border border-accent/20 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Manifesto & Visão</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-5xl text-ink tracking-tight">
          Sobre o <span className="text-accent-text">ManausDev</span>
        </h1>
        <p className="text-muted text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
          Nossa missão é conectar, potencializar e dar visibilidade global aos talentos de tecnologia e bioeconomia que constroem a partir do Amazonas.
        </p>
      </div>

      <div className="space-y-8 text-muted text-sm sm:text-base leading-relaxed">
        <div className="manaus-card p-6 sm:p-8 border-t-4 border-t-deep">
          <h2 className="font-display font-bold text-xl text-ink mb-3">O que é a Plataforma?</h2>
          <p>
            O <strong>ManausDev</strong> é uma iniciativa independente e aberta voltada a centralizar o ecossistema tecnológico de Manaus e de todo o estado do Amazonas. Conectamos desenvolvedores, designers, pesquisadores, dados, comunidades locais e empresas do Polo Industrial e de bioeconomia sustentável.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="manaus-card p-6 border-t-4 border-t-deep">
            <div className="w-10 h-10 rounded-lg bg-deep text-white flex items-center justify-center mb-4 shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-ink mb-2">Visibilidade Regional</h3>
            <p className="text-xs text-faint">
              Dar palco aos projetos de software e inovação criados por profissionais no Norte do Brasil.
            </p>
          </div>

          <div className="manaus-card p-6 border-t-4 border-t-accent">
            <div className="w-10 h-10 rounded-lg bg-accent text-white flex items-center justify-center mb-4 shadow-sm">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-ink mb-2">Comunidade & Open Source</h3>
            <p className="text-xs text-faint">
              Fortalecer grupos de estudo, meetups e compartilhamento livre de conhecimento técnico.
            </p>
          </div>

          <div className="manaus-card p-6 border-t-4 border-t-cyan">
            <div className="w-10 h-10 rounded-lg bg-deep text-white flex items-center justify-center mb-4 shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-ink mb-2">Conexão com Mercado</h3>
            <p className="text-xs text-faint">
              Aproximar talentos de empresas inovadoras e oportunidades no Polo Industrial e exterior.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
