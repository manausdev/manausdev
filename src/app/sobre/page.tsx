import { Sparkles, Shield, Heart, Compass } from 'lucide-react';

export default function SobrePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#006c49]/10 text-[#006c49] border border-[#006c49]/20 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Manifesto & Visão</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-5xl text-[#003527] tracking-tight">
          Sobre o <span className="text-[#006c49]">ManausDev</span>
        </h1>
        <p className="text-[#404944] text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
          Nossa missão é conectar, potencializar e dar visibilidade global aos talentos de tecnologia e bioeconomia que constroem a partir do Amazonas.
        </p>
      </div>

      <div className="space-y-8 text-[#404944] text-sm sm:text-base leading-relaxed">
        <div className="manaus-card p-6 sm:p-8 border-t-4 border-t-[#003527]">
          <h2 className="font-display font-bold text-xl text-[#003527] mb-3">O que é a Plataforma?</h2>
          <p>
            O <strong>ManausDev</strong> é uma iniciativa independente e aberta voltada a centralizar o ecossistema tecnológico de Manaus e de todo o estado do Amazonas. Conectamos desenvolvedores, designers, pesquisadores, dados, comunidades locais e empresas do Polo Industrial e de bioeconomia sustentável.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="manaus-card p-6 border-t-4 border-t-[#003527]">
            <div className="w-10 h-10 rounded-lg bg-[#003527] text-white flex items-center justify-center mb-4 shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-[#003527] mb-2">Visibilidade Regional</h3>
            <p className="text-xs text-[#707974]">
              Dar palco aos projetos de software e inovação criados por profissionais no Norte do Brasil.
            </p>
          </div>

          <div className="manaus-card p-6 border-t-4 border-t-[#006c49]">
            <div className="w-10 h-10 rounded-lg bg-[#006c49] text-white flex items-center justify-center mb-4 shadow-sm">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-[#003527] mb-2">Comunidade & Open Source</h3>
            <p className="text-xs text-[#707974]">
              Fortalecer grupos de estudo, meetups e compartilhamento livre de conhecimento técnico.
            </p>
          </div>

          <div className="manaus-card p-6 border-t-4 border-t-[#00314a]">
            <div className="w-10 h-10 rounded-lg bg-[#00314a] text-white flex items-center justify-center mb-4 shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-[#003527] mb-2">Conexão com Mercado</h3>
            <p className="text-xs text-[#707974]">
              Aproximar talentos de empresas inovadoras e oportunidades no Polo Industrial e exterior.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
