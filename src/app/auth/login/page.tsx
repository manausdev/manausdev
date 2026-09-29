'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { GithubIcon } from '@/components/icons';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get('redirectedFrom') || searchParams.get('redirectTo') || '/dashboard';
  const callbackError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(
    callbackError === 'callback-failed'
      ? 'Falha na autenticação com o provedor. Tente novamente.'
      : null
  );

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
        router.push(redirectedFrom);
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
    <div className="w-full max-w-md">
      <div className="manaus-card p-8 sm:p-10 relative overflow-hidden shadow-card-ambient border border-border">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-deep text-white mb-4 shadow-sm">
            <span className="text-2xl font-mono">🌿</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-ink">Bem-vindo de volta</h1>
          <p className="text-xs text-muted mt-1.5">
            Acesse sua conta ManausDev e gerencie seu perfil profissional
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-lg bg-danger-soft border border-danger/30 text-danger-text text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-danger" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
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
            <label className="block text-xs font-semibold text-ink mb-1.5">Senha</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
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
            <div className="w-full border-t border-border" />
          </div>
          <span className="relative bg-surface px-3 text-[11px] font-mono text-faint font-medium">
            OU ENTRE COM
          </span>
        </div>

        <button
          onClick={() => handleOAuthLogin('github')}
          type="button"
          className="flex items-center justify-center gap-2.5 w-full py-2.5 rounded-lg text-xs font-semibold bg-surface-1 hover:bg-surface-2 text-ink border border-border transition-colors"
        >
          <GithubIcon className="w-4 h-4" />
          Continuar com GitHub
        </button>

        <p className="mt-8 text-center text-xs text-muted">
          Ainda não possui uma conta?{' '}
          <Link href="/auth/register" className="text-accent-text font-bold hover:underline">
            Cadastre-se grátis
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-canvas">
      <Suspense fallback={
        <div className="manaus-card p-10 text-center max-w-md w-full animate-pulse">
          <div className="h-8 w-8 bg-accent/20 rounded-full mx-auto mb-4" />
          <div className="h-4 bg-surface-2 rounded w-3/4 mx-auto" />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
