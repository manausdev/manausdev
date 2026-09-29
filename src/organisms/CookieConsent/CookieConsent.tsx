'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheckIcon, XIcon } from '@/components/icons';
import styles from './CookieConsent.module.css';

const CONSENT_KEY = 'manausdev_cookie_consent';

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <aside
      aria-label="Consentimento de Cookies e Privacidade"
      className={styles.aside}
    >
      <div className={styles.card}>
        <div className={styles.row}>
          <div className={styles.iconBox}>
            <ShieldCheckIcon className={styles.icon} />
          </div>
          <div className={styles.body}>
            <h3 className={styles.title}>Privacidade & Transparência 🌿</h3>
            <p className={styles.text}>
              Utilizamos cookies essenciais para manter sua sessão e melhorar a navegação
              na plataforma. Em conformidade com a LGPD, seus dados pessoais estão
              protegidos.
            </p>
            <div className={styles.actions}>
              <button onClick={handleAccept} className={styles.accept}>
                Concordar e Continuar
              </button>
              <Link href="/privacidade" className={styles.more}>
                Saiba mais
              </Link>
            </div>
          </div>
          <button
            onClick={handleDecline}
            className={styles.close}
            title="Fechar"
            aria-label="Fechar banner"
          >
            <XIcon className={styles.closeIcon} />
          </button>
        </div>
      </div>
    </aside>
  );
}
