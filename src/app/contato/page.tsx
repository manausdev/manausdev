'use client';

import { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export default function ContatoPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#006c49]/10 text-[#006c49] border border-[#006c49]/20 text-xs font-semibold mb-3">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Fale Conosco</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#003527]">Contato & Parcerias</h1>
        <p className="text-[#404944] text-sm mt-2">
          Dúvidas, parcerias, sugestões ou interesse em apoiar as iniciativas da ManausDev.
        </p>
      </div>

      <div className="manaus-card p-8">
        {sent ? (
          <div className="text-center py-10 space-y-3">
            <div className="inline-flex p-3 rounded-full bg-[#6cf8bb]/30 text-[#00714d] mb-2">
              <CheckCircle2 className="w-8 h-8 text-[#006c49]" />
            </div>
            <h2 className="font-display font-bold text-xl text-[#003527]">Mensagem Recebida!</h2>
            <p className="text-xs text-[#404944]">
              Obrigado por entrar em contato. Um dos membros da comunidade responderá em breve.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#003527] mb-1.5">Seu Nome</label>
                <input
                  type="text"
                  required
                  placeholder="Nome"
                  className="manaus-input w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#003527] mb-1.5">Seu Email</label>
                <input
                  type="email"
                  required
                  placeholder="seu.email@exemplo.com"
                  className="manaus-input w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#003527] mb-1.5">Assunto</label>
              <input
                type="text"
                required
                placeholder="Ex: Parceria institucional / Sugestão de funcionalidade"
                className="manaus-input w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#003527] mb-1.5">Mensagem</label>
              <textarea
                rows={4}
                required
                placeholder="Escreva sua mensagem detalhada..."
                className="manaus-input w-full"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full sm:w-auto text-xs !py-3 !px-6"
            >
              <Send className="w-4 h-4" />
              Enviar Mensagem
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
