export default function PrivacidadePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-display font-black text-3xl sm:text-4xl text-white mb-6">Política de Privacidade</h1>
      <div className="glass-card p-6 sm:p-8 space-y-6 text-sm text-slate-300 leading-relaxed">
        <p>
          A ManausDev respeita a privacidade de seus usuários e atua em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
        </p>

        <h2 className="font-display font-bold text-lg text-white">1. Coleta de Informações</h2>
        <p>
          Coletamos apenas as informações públicas que você decide compartilhar para compor seu portfólio de desenvolvedor (nome, username, bio, links do GitHub/Linkedin e tecnologias).
        </p>

        <h2 className="font-display font-bold text-lg text-white">2. Uso dos Dados</h2>
        <p>
          Seus dados são utilizados exclusivamente para permitir a descoberta profissional, conexões de networking regional e participação nas iniciativas da comunidade.
        </p>

        <h2 className="font-display font-bold text-lg text-white">3. Seus Direitos</h2>
        <p>
          Você pode, a qualquer momento, editar ou excluir seus dados diretamente no seu painel de controle (Dashboard) ou solicitando a exclusão de sua conta.
        </p>
      </div>
    </div>
  );
}
