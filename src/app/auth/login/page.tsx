'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { GithubIcon } from '@/components/icons';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      if (data.user) {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erro inesperado ao realizar login.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'github') => {
    try {
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erro ao conectar via provedor OAuth.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#f7f9fb]">
      <div className="w-full max-w-md">
        <div className="manaus-card p-8 sm:p-10 relative overflow-hidden shadow-card-ambient border border-[#e0e3e5]">
          <div className="text-center mb-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#003527] text-white mb-4 shadow-sm">
              <span className="text-2xl font-mono">🌿</span>
            </div>
            <h1 className="font-display font-bold text-2xl text-[#003527]">Bem-vindo de volta</h1>
            <p className="text-xs text-[#404944] mt-1.5">
              Acesse sua conta ManausDev e gerencie seu perfil profissional
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-lg bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#93000a] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#ba1a1a]" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#003527] mb-1.5">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#707974]" />
                <input
                  type="email"
                  required
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="manaus-input w-full pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#003527] mb-1.5">Senha</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#707974]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="manaus-input w-full pl-10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3 disabled:opacity-50 mt-2"
            >
              {loading ? 'Entrando...' : 'Entrar na Plataforma'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e0e3e5]" />
            </div>
            <span className="relative bg-[#ffffff] px-3 text-[11px] font-mono text-[#707974] font-medium">
              OU ENTRE COM
            </span>
          </div>

          <button
            onClick={() => handleOAuthLogin('github')}
            type="button"
            className="flex items-center justify-center gap-2.5 w-full py-2.5 rounded-lg text-xs font-semibold bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#003527] border border-[#e0e3e5] transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
            Continuar com GitHub
          </button>

          <p className="mt-8 text-center text-xs text-[#404944]">
            Ainda não possui uma conta?{' '}
            <Link href="/auth/register" className="text-[#006c49] font-bold hover:underline">
              Cadastre-se grátis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
