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
  UserCircle2,
  LogIn,
  LogOut,
  LayoutDashboard
} from 'lucide-react';

const NAV_LINKS = [
  { href: '/devs', label: 'Devs', icon: Users },
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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070A12]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#00F5FF]/20 to-[#10B981]/20 border border-[#00F5FF]/40 text-[#00F5FF] group-hover:scale-105 transition-transform duration-200">
            <span className="font-bold text-lg font-mono">🌿</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-lg tracking-tight text-white flex items-center gap-1">
              Manaus<span className="text-[#00F5FF]">Dev</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono tracking-wider -mt-1 font-medium">
              AMAZONAS • BR
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#00F5FF]/10 text-[#00F5FF] border border-[#00F5FF]/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 opacity-80" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth / Action */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="h-8 w-20 bg-slate-800 animate-pulse rounded-lg" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 hover:bg-[#10B981]/25 transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleSignOut}
                title="Sair da conta"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-white/5 transition-colors"
              >
                <LogIn className="w-4 h-4 text-slate-400" />
                Entrar
              </Link>
              <Link
                href="/auth/register"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold bg-[#00F5FF] text-[#00282B] hover:bg-[#5df7ff] shadow-[0_0_15px_-3px_rgba(0,245,255,0.4)] transition-all duration-200"
              >
                Cadastrar
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          aria-label="Abrir menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0E1424] px-4 py-4 space-y-2">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#00F5FF]/10 text-[#00F5FF] border border-[#00F5FF]/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm font-medium bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Meu Painel
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm font-medium text-slate-200 border border-white/10 hover:bg-white/5"
                >
                  Entrar
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm font-semibold bg-[#00F5FF] text-[#00282B]"
                >
                  Criar Conta
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
