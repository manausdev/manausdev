'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ThemeToggle } from '@/organisms/ThemeToggle/ThemeToggle';
import { User } from '@supabase/supabase-js';
import {
  UsersIcon,
  Code2Icon,
  BriefcaseIcon,
  SparklesIcon,
  MenuIcon,
  XIcon,
  CalendarDaysIcon,
  Building2Icon,
  CompassIcon,
  LogOutIcon,
  LayoutDashboardIcon,
  LogoIcon,
} from '@/components/icons';
import { cn } from '@/lib/utils';
import styles from './Header.module.css';

const NAV_LINKS = [
  { href: '/devs', label: 'Desenvolvedores', icon: UsersIcon },
  { href: '/projetos', label: 'Projetos', icon: Code2Icon },
  { href: '/vagas', label: 'Vagas', icon: BriefcaseIcon },
  { href: '/comunidades', label: 'Comunidades', icon: SparklesIcon },
  { href: '/noticias', label: 'Notícias', icon: CompassIcon },
  { href: '/eventos', label: 'Eventos', icon: CalendarDaysIcon },
  { href: '/empresas', label: 'Empresas', icon: Building2Icon },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        setUser(data.user);
        setLoading(false);
      }).catch(() => setLoading(false));

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    } catch {
      setLoading(false);
    }
  }, []);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (err) {
      console.error('Erro ao sair:', err);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <LogoIcon size={36} className={styles.logo} />
          <div className={styles.brandText}>
            <span className={styles.brandName}>
              Manaus<span className={styles.brandAccent}>Dev</span>
            </span>
            <span className={styles.brandTag}>AMAZONAS • TECH</span>
          </div>
        </Link>

        <nav className={styles.nav}>
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(styles.navLink, isActive && styles.navLinkActive)}
              >
                <Icon className={styles.navIcon} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.auth}>
          <ThemeToggle />
          {loading ? (
            <div className={styles.skeleton} />
          ) : user ? (
            <div className={styles.authUser}>
              <Link href="/dashboard" className={styles.painelBtn}>
                <LayoutDashboardIcon size="xs" />
                <span>Painel</span>
              </Link>
              <button
                onClick={handleSignOut}
                title="Sair da conta"
                aria-label="Sair da conta"
                className={styles.signOut}
              >
                <LogOutIcon />
              </button>
            </div>
          ) : (
            <div className={styles.authGuest}>
              <Link href="/auth/login" className={styles.loginLink}>
                Entrar
              </Link>
              <Link href="/auth/register" className={styles.registerBtn}>
                Criar Conta
              </Link>
            </div>
          )}
        </div>

        <div className={styles.mobileTrigger}>
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={styles.menuButton}
            aria-label="Abrir menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <XIcon size="lg" /> : <MenuIcon size="lg" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(styles.mobileLink, isActive && styles.mobileLinkActive)}
              >
                <Icon />
                {label}
              </Link>
            );
          })}
          <div className={styles.mobileAuth}>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={styles.mobileBtnLeaf}
                >
                  <LayoutDashboardIcon />
                  Meu Painel
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className={styles.mobileSignOut}
                >
                  Sair da Conta
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={styles.mobileBtnSecondary}
                >
                  Entrar
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className={styles.mobileBtnPrimary}
                >
                  Criar Conta Grátis
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
