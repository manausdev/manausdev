'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/infrastructure/supabase/client';
import { UsersIcon, SaveIcon, AlertCircleIcon, CheckCircle2Icon } from '@/components/icons';
import styles from './novo.module.css';

export default function NovaComunidadePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    type: 'tech',
    logo_url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login?redirectedFrom=/comunidades/novo');
        return;
      }

      const payload = {
        name: form.name,
        description: form.description,
        type: form.type,
        logo_url: form.logo_url || null,
        members_count: 0,
      };

      const { error: insertError } = await supabase.from('communities').insert([payload]);
      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => router.push('/comunidades'), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao criar comunidade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <UsersIcon className={styles.icon} />
        <h1>Nova Comunidade</h1>
        <p>Cadastre uma comunidade para a rede</p>
      </div>

      {success && (
        <div className={styles.success}>
          <CheckCircle2Icon className={styles.iconSm} />
          Comunidade criada com sucesso! Redirecionando...
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
          <label>Nome da Comunidade *</label>
          <input
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Ex: ManausDev"
          />
        </div>

        <div className={styles.field}>
          <label>Tipo</label>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="tech">Tech</option>
            <option value="startup">Startup</option>
            <option value="education">Educação</option>
            <option value="other">Outro</option>
          </select>
        </div>

        <div className={styles.field}>
          <label>Logo URL</label>
          <input
            type="url"
            value={form.logo_url}
            onChange={e => setForm({ ...form, logo_url: e.target.value })}
            placeholder="https://..."
          />
        </div>

        <div className={styles.field}>
          <label>Descrição *</label>
          <textarea
            required
            rows={5}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Descreva a comunidade..."
          />
        </div>

        <button type="submit" disabled={loading} className={styles.submit}>
          <SaveIcon className={styles.iconSm} />
          {loading ? 'Salvando...' : 'Criar Comunidade'}
        </button>
      </form>
    </div>
  );
}
