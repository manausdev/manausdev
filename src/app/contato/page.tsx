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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00F5FF]/10 text-[#00F5FF] border border-[#00F5FF]/25 text-xs font-mono mb-3">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Fale Conosco</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white">Contato & Parcerias</h1>
        <p className="text-slate-400 text-sm mt-2">
          Dúvidas, parcerias, sugestões ou interesse em apoiar a comunidade ManausDev.
        </p>
      </div>

      <div className="glass-card p-8">
        {sent ? (
          <div className="text-center py-10 space-y-3">
            <div className="inline-flex p-3 rounded-full bg-emerald-500/15 text-emerald-400 mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-display font-bold text-xl text-white">Mensagem Recebida!</h2>
            <p className="text-xs text-slate-300">
              Obrigado por entrar em contato. Um dos mantenedores responderá em breve.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Seu Nome</label>
                <input
                  type="text"
                  required
                  placeholder="Nome"
                  className="w-full bg-[#070A12]/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00F5FF]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Seu Email</label>
                <input
                  type="email"
                  required
                  placeholder="seu.email@exemplo.com"
                  className="w-full bg-[#070A12]/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00F5FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">Assunto</label>
              <input
                type="text"
                required
                placeholder="Ex: Parceria institucional / Sugestão de funcionalidade"
                className="w-full bg-[#070A12]/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00F5FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">Mensagem</label>
              <textarea
                rows={4}
                required
                placeholder="Escreva sua mensagem detalhada..."
                className="w-full bg-[#070A12]/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00F5FF]"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold bg-[#00F5FF] text-[#00282B] hover:bg-[#5df7ff] shadow-glow-primary transition-all"
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
