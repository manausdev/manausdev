import { TextTemplate } from '@/routes';

export default function PrivacidadePage() {
  return (
    <TextTemplate title="Política de Privacidade">
      <p>
        A ManausDev respeita a privacidade de seus usuários e atua em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
      </p>

      <h2>1. Coleta de Informações</h2>
      <p>
        Coletamos apenas as informações públicas que você decide compartilhar para compor seu portfólio profissional (nome, username, bio, links do GitHub/Linkedin e tecnologias).
      </p>

      <h2>2. Uso dos Dados</h2>
      <p>
        Seus dados são utilizados exclusivamente para permitir a descoberta profissional, conexões de networking regional e participação nas iniciativas da comunidade.
      </p>

      <h2>3. Seus Direitos</h2>
      <p>
        Você pode, a qualquer momento, editar ou excluir seus dados diretamente no seu painel de controle (Dashboard) ou solicitando a exclusão de sua conta.
      </p>
    </TextTemplate>
  );
}