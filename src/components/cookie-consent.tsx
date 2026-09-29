'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, X } from 'lucide-react';

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('manausdev_cookie_consent');
    if (!consent) {
      // Delay slightly for smooth page entry
      const timer = setTimeout(() => setShow(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('manausdev_cookie_consent', 'accepted');
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem('manausdev_cookie_consent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <aside
      aria-label="Consentimento de Cookies e Privacidade"
      className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="bg-surface border border-accent/30 rounded-2xl p-5 shadow-elevated">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-accent/10 text-accent-text flex-shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 flex-1">
            <h3 className="font-display font-bold text-sm text-ink">
              Privacidade & Transparência 🌿
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Utilizamos cookies essenciais para manter sua sessão e melhorar a navegação na plataforma. Em conformidade com a LGPD, seus dados pessoais estão protegidos.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleAccept}
                className="btn-leaf text-xs !py-1.5 !px-3.5"
              >
                Concordar e Continuar
              </button>
              <Link
                href="/privacidade"
                className="text-xs text-accent-text hover:underline font-semibold"
              >
                Saiba mais
              </Link>
            </div>
          </div>
          <button
            onClick={handleDecline}
            className="text-faint hover:text-ink p-1 -mr-1 -mt-1"
            title="Fechar"
            aria-label="Fechar banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

