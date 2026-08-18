'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock, User, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from '@/components/icons';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_name: username.toLowerCase().replace(/[^a-z0-9_-]/g, ''),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      if (data.session) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setSuccessMsg('Conta criada com sucesso! Verifique seu email para confirmar o cadastro ou faça login.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erro inesperado ao criar conta.');
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
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#f7f9fb]">
      <div className="w-full max-w-md">
        <div className="manaus-card p-8 sm:p-10 relative overflow-hidden shadow-card-ambient border border-[#e0e3e5]">
          <div className="text-center mb-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#003527] text-white mb-4 shadow-sm">
              <span className="text-2xl font-mono">🌿</span>
            </div>
            <h1 className="font-display font-bold text-2xl text-[#003527]">Junte-se à ManausDev</h1>
            <p className="text-xs text-[#404944] mt-1.5">
              Crie seu perfil profissional e conecte-se com o ecossistema
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-lg bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#93000a] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#ba1a1a]" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-3.5 rounded-lg bg-[#6cf8bb]/20 border border-[#006c49]/30 text-[#00714d] text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#006c49]" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#003527] mb-1.5">Nome Completo</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#707974]" />
                <input
                  type="text"
                  required
                  placeholder="Seu Nome Completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="manaus-input w-full pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#003527] mb-1.5">Username (@)</label>
              <div className="relative">
                <span className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#707974] font-mono text-xs">@</span>
                <input
                  type="text"
                  required
                  placeholder="seunome"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="manaus-input w-full pl-10"
                />
              </div>
            </div>

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
              <label className="block text-xs font-semibold text-[#003527] mb-1.5">Senha (mínimo 6 caracteres)</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#707974]" />
                <input
                  type="password"
                  required
                  minLength={6}
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
              className="btn-leaf w-full !py-3 disabled:opacity-50 mt-2"
            >
              {loading ? 'Criando conta...' : 'Criar meu Cadastro'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e0e3e5]" />
            </div>
            <span className="relative bg-[#ffffff] px-3 text-[11px] font-mono text-[#707974] font-medium">
              OU CADASTRE COM
            </span>
          </div>

          <button
            onClick={() => handleOAuthLogin('github')}
            type="button"
            className="flex items-center justify-center gap-2.5 w-full py-2.5 rounded-lg text-xs font-semibold bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#003527] border border-[#e0e3e5] transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
            Cadastrar com GitHub
          </button>

          <p className="mt-8 text-center text-xs text-[#404944]">
            Já tem uma conta?{' '}
            <Link href="/auth/login" className="text-[#006c49] font-bold hover:underline">
              Entrar aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
