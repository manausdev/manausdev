'use client';

import { useState } from 'react';
import { MessageSquareIcon, SendIcon, CheckCircle2Icon, AlertCircleIcon } from '@/components/icons';
import { createClient } from '@/infrastructure/supabase/client';
import type { Database } from '@/types/database';
import styles from './contato.module.css';

export default function ContatoPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const payload: Database['public']['Tables']['contacts']['Insert'] = {
        name,
        email,
        subject,
        message,
      };

      const { error } = await supabase
        .from('contacts')
        // @ts-expect-error Supabase query builder insert overload inference
        .insert(payload);

      if (error) {
        setErrorMsg(
          'Não foi possível enviar sua mensagem agora. Tente novamente em instantes.'
        );
        return;
      }

      setSent(true);
    } catch {
      setErrorMsg(
        'Não foi possível enviar sua mensagem agora. Tente novamente em instantes.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>
          <MessageSquareIcon />
          <span>Fale Conosco</span>
        </div>
        <h1 className={styles.heroTitle}>Contato & Parcerias</h1>
        <p className={styles.heroSubtitle}>
          Dúvidas, parcerias, sugestões ou interesse em apoiar as iniciativas da ManausDev.
        </p>
      </div>

      <div className={styles.card}>
        {sent ? (
          <div className={styles.success}>
            <div className={styles.successIcon}>
              <CheckCircle2Icon size="lg" />
            </div>
            <h2 className={styles.successTitle}>Mensagem Recebida!</h2>
            <p className={styles.successText}>
              Obrigado por entrar em contato, <strong className={styles.successName}>{name}</strong>.
              Nossa equipe responderá no e-mail{' '}
              <span className={styles.successEmail}>{email}</span> em breve.
            </p>
            <button
              onClick={() => {
                setSent(false);
                setName('');
                setEmail('');
                setSubject('');
                setMessage('');
              }}
              className={styles.successBtn}
            >
              Enviar outra mensagem
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {errorMsg && (
              <div className={styles.error}>
                <AlertCircleIcon className={styles.errorIcon} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className={styles.formRow}>
              <div>
                <label className={styles.label}>Seu Nome</label>
                <input
                  type="text"
                  required
                  placeholder="Nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div>
                <label className={styles.label}>Seu Email</label>
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
              <label className={styles.label}>Assunto</label>
              <input
                type="text"
                required
                placeholder="Ex: Parceria institucional / Sugestão de funcionalidade"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={styles.input}
              />
            </div>

            <div>
              <label className={styles.label}>Mensagem</label>
              <textarea
                rows={4}
                required
                placeholder="Escreva sua mensagem detalhada..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={styles.textarea}
              />
            </div>

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              <SendIcon />
              <span>{loading ? 'Enviando...' : 'Enviar Mensagem'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
