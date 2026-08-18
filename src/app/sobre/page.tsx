import { Sparkles, Shield, Heart, Compass } from 'lucide-react';

export default function SobrePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/25 text-xs font-mono mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Manifesto Comunitário</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
          Sobre o <span className="gradient-text-cyber">ManausDev</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
          Nossa missão é conectar, empoderar e dar visibilidade global aos talentos de tecnologia que constroem a partir do Amazonas.
        </p>
      </div>

      <div className="space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed">
        <div className="glass-card p-6 sm:p-8">
          <h2 className="font-display font-bold text-xl text-white mb-3">O que é a Plataforma?</h2>
          <p>
            O <strong>ManausDev</strong> é uma iniciativa independente e aberta voltada a centralizar o ecossistema tecnológico de Manaus e de todo o estado do Amazonas. Aqui conectamos desenvolvedores, designers, pesquisadores, dados, comunidades locais e empresas do Polo Industrial e de bioeconomia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6">
            <div className="w-10 h-10 rounded-xl bg-[#00F5FF]/15 text-[#00F5FF] flex items-center justify-center mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-white mb-2">Visibilidade Regional</h3>
            <p className="text-xs text-slate-400">
              Dar palco aos projetos incríveis criados por profissionais e acadêmicos no Norte do país.
            </p>
          </div>

          <div className="glass-card p-6">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center mb-4">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-white mb-2">Comunidade & Open Source</h3>
            <p className="text-xs text-slate-400">
              Fortalecer grupos de estudo, meetups e compartilhamento livre de conhecimento.
            </p>
          </div>

          <div className="glass-card p-6">
            <div className="w-10 h-10 rounded-xl bg-[#818CF8]/15 text-[#818CF8] flex items-center justify-center mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-white mb-2">Conexão com Mercado</h3>
            <p className="text-xs text-slate-400">
              Aproximar talentos de empresas inovadoras e oportunidades no Polo Industrial e exterior.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
