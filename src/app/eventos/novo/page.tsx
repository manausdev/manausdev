'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/infrastructure/supabase/client';
import type { Database } from '@/types/database';
import { CalendarDaysIcon, SaveIcon, AlertCircleIcon, CheckCircle2Icon } from '@/components/icons';
import styles from './novo.module.css';

export default function NovoEventoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    type: 'meetup',
    link: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login?redirectedFrom=/eventos/novo');
        return;
      }

      const payload: Database['public']['Tables']['events']['Insert'] = {
        title: form.title,
        description: form.description || null,
        date: new Date(form.date).toISOString(),
        location: form.location,
        type: form.type,
        link: form.link || null,
        organizer_id: user.id,
      };

      const { error: insertError } = await supabase.from('events').insert([payload]);
      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => router.push('/eventos'), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao criar evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <CalendarDaysIcon className={styles.icon} />
        <h1>Novo Evento</h1>
        <p>Cadastre um evento para a comunidade</p>
      </div>

      {success && (
        <div className={styles.success}>
          <CheckCircle2Icon className={styles.iconSm} />
          Evento criado com sucesso! Redirecionando...
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <AlertCircleIcon className={styles.iconSm} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label>Título do Evento *</label>
          <input
            required
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Ex: ManausDev Meetup #42"
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>Data *</label>
            <input
              type="datetime-local"
              required
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label>Localização *</label>
            <input
              required
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              placeholder="Manaus-AM"
            />
          </div>
        </div>

        <div className={styles.field}>
          <label>Tipo</label>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="meetup">Meetup</option>
            <option value="hackathon">Hackathon</option>
            <option value="workshop">Workshop</option>
            <option value="conference">Conference</option>
          </select>
        </div>

        <div className={styles.field}>
          <label>Link do Evento</label>
          <input
            type="url"
            value={form.link}
            onChange={e => setForm({ ...form, link: e.target.value })}
            placeholder="https://..."
          />
        </div>

        <div className={styles.field}>
          <label>Descrição</label>
          <textarea
            rows={5}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Descreva o evento..."
          />
        </div>

        <button type="submit" disabled={loading} className={styles.submit}>
          <SaveIcon className={styles.iconSm} />
          {loading ? 'Salvando...' : 'Publicar Evento'}
        </button>
      </form>
    </div>
  );
}
