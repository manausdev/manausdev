'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { 
  Users, 
  Code2, 
  Briefcase, 
  Sparkles, 
  Menu, 
  X, 
  Calendar, 
  Building2, 
  LogIn,
  LogOut,
  LayoutDashboard
} from 'lucide-react';

const NAV_LINKS = [
  { href: '/devs', label: 'Desenvolvedores', icon: Users },
  { href: '/projetos', label: 'Projetos', icon: Code2 },
  { href: '/vagas', label: 'Vagas', icon: Briefcase },
  { href: '/comunidades', label: 'Comunidades', icon: Sparkles },
  { href: '/eventos', label: 'Eventos', icon: Calendar },
  { href: '/empresas', label: 'Empresas', icon: Building2 },
];

export function Navbar() {
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
    <header className="sticky top-0 z-50 border-b border-[#e0e3e5] bg-[#ffffff]/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#003527] text-white shadow-sm group-hover:bg-[#064e3b] transition-colors">
            <span className="font-bold text-base font-mono">🌿</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg tracking-tight text-[#003527] flex items-center">
              Manaus<span className="text-[#006c49]">Dev</span>
            </span>
            <span className="text-[10px] text-[#006c49] font-mono tracking-widest -mt-1 font-semibold">
              AMAZONAS • TECH
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#003527]/10 text-[#003527] font-semibold'
                    : 'text-[#404944] hover:text-[#003527] hover:bg-[#f2f4f6]'
                }`}
              >
                <Icon className="w-4 h-4 opacity-75" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="h-8 w-20 bg-[#e0e3e5] animate-pulse rounded-lg" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="btn-leaf text-xs !py-2 !px-3.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Painel</span>
              </Link>
              <button
                onClick={handleSignOut}
                title="Sair da conta"
                className="p-2 rounded-lg text-[#707974] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/auth/login"
                className="px-3.5 py-2 rounded-lg text-sm font-semibold text-[#003527] hover:bg-[#f2f4f6] transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/auth/register"
                className="btn-primary text-xs !py-2 !px-4"
              >
                Criar Conta
              </Link>
            </div>
          )}
        </div>

        {/* Mobile trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-[#404944] hover:text-[#003527] hover:bg-[#f2f4f6]"
          aria-label="Abrir menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#e0e3e5] bg-[#ffffff] px-4 py-4 space-y-2">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#003527]/10 text-[#003527] font-semibold'
                    : 'text-[#404944] hover:text-[#003527] hover:bg-[#f2f4f6]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-[#e0e3e5] flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-leaf w-full justify-center"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Meu Painel
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="w-full py-2.5 rounded-lg text-xs font-semibold text-[#ba1a1a] bg-[#ffdad6]/40 hover:bg-[#ffdad6]/70 transition-colors"
                >
                  Sair da Conta
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-secondary w-full justify-center"
                >
                  Entrar
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary w-full justify-center"
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
