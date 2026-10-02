'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/infrastructure/supabase/client';
import { MailIcon, LockIcon, AlertCircleIcon, ArrowRightIcon } from '@/components/icons';
import { GithubIcon } from '@/components/icons';
import styles from './login.module.css';

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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro inesperado ao realizar login.';
      setErrorMsg(message);
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao conectar via provedor OAuth.';
      setErrorMsg(message);
    }
  };

  return (
    <>
        {errorMsg && (
          <div className={styles.errorBanner}>
            <AlertCircleIcon className={styles.bannerIconError} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleEmailLogin} className={styles.form}>
          <div>
            <label className={styles.label}>Email</label>
            <div className={styles.inputWrap}>
              <MailIcon className={styles.fieldIcon} />
              <input
                type="email"
                required
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div>
            <label className={styles.label}>Senha</label>
            <div className={styles.inputWrap}>
              <LockIcon className={styles.fieldIcon} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.btnPrimary}
          >
            {loading ? 'Entrando...' : 'Entrar na Plataforma'}
            <ArrowRightIcon className={styles.btnIcon} />
          </button>
        </form>

        <div className={styles.divider}>
          <div className={styles.dividerLine} />
          <span className={styles.dividerText}>OU ENTRE COM</span>
          <div className={styles.dividerLine} />
        </div>

        <button
          onClick={() => handleOAuthLogin('github')}
          type="button"
          className={styles.oauthBtn}
        >
          <GithubIcon className={styles.oauthIcon} />
          Continuar com GitHub
        </button>

        <p className={styles.footer}>
          Ainda não possui uma conta?{' '}
          <Link href="/auth/register" className={styles.footerLink}>
            Cadastre-se grátis
          </Link>
        </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconBox}>
            <span>🌿</span>
          </div>
          <h1 className={styles.title}>Bem-vindo de volta</h1>
          <p className={styles.subtitle}>
            Acesse sua conta ManausDev e gerencie seu perfil profissional
          </p>
        </div>
        <Suspense
          fallback={
            <div className={styles.fallbackPage}>
              <div className={styles.fallback}>
                <div className={styles.fallbackDot} />
                <div className={styles.fallbackBar} />
              </div>
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}