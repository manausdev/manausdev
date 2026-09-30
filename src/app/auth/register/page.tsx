'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { MailIcon, LockIcon, UserIcon, AlertCircleIcon, ArrowRightIcon, CheckCircle2Icon } from '@/components/icons';
import { GithubIcon } from '@/components/icons';
import { AuthTemplate } from '@/routes';
import styles from '../auth.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      setErrorMsg('Você precisa concordar com os Termos de Uso e a Política de Privacidade.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_-]/g, '');

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_name: cleanUsername,
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro inesperado ao criar conta.';
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
    <AuthTemplate
      icon={<span>🌿</span>}
      title="Junte-se à ManausDev"
      subtitle="Crie seu perfil profissional e conecte-se com o ecossistema"
    >
      {errorMsg && (
        <div className={styles.errorBanner}>
          <AlertCircleIcon className={`${styles.bannerIcon} ${styles.bannerIconDanger}`} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className={styles.successBanner}>
          <CheckCircle2Icon className={`${styles.bannerIcon} ${styles.bannerIconSuccess}`} />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className={styles.form}>
        <div>
          <label className={styles.label}>Nome Completo</label>
          <div className={styles.inputWrap}>
            <UserIcon className={styles.fieldIcon} />
            <input
              type="text"
              required
              placeholder="Seu Nome Completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={styles.input}
            />
          </div>
        </div>

        <div>
          <label className={styles.label}>Username (@)</label>
          <div className={styles.inputWrap}>
            <span className={styles.fieldPrefix}>@</span>
            <input
              type="text"
              required
              placeholder="seunome"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
              className={styles.input}
            />
          </div>
        </div>

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
          <label className={styles.label}>Senha (mínimo 6 caracteres)</label>
          <div className={styles.inputWrap}>
            <LockIcon className={styles.fieldIcon} />
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.termsRow}>
          <input
            type="checkbox"
            id="terms"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className={styles.checkbox}
          />
          <label htmlFor="terms" className={styles.termsLabel}>
            Concordo com os{' '}
            <Link href="/termos" target="_blank" className={styles.termsLink}>
              Termos de Uso
            </Link>{' '}
            e a{' '}
            <Link href="/privacidade" target="_blank" className={styles.termsLink}>
              Política de Privacidade
            </Link>
            .
          </label>
        </div>

        <button type="submit" disabled={loading} className={styles.btnLeaf}>
          {loading ? 'Criando conta...' : 'Criar meu Cadastro'}
          <ArrowRightIcon className={styles.btnIcon} />
        </button>
      </form>

      <div className={styles.divider}>
        <div className={styles.dividerLine} />
        <span className={styles.dividerText}>OU CADASTRE COM</span>
      </div>

      <button
        onClick={() => handleOAuthLogin('github')}
        type="button"
        className={styles.oauthBtn}
      >
        <GithubIcon className={styles.btnIcon} />
        Cadastrar com GitHub
      </button>

      <p className={styles.footer}>
        Já tem uma conta?{' '}
        <Link href="/auth/login" className={styles.footerLink}>
          Entrar aqui
        </Link>
      </p>
    </AuthTemplate>
  );
}
