'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/infrastructure/supabase/client';
import { BuildingIcon, SaveIcon, AlertCircleIcon, CheckCircle2Icon } from '@/components/icons';
import styles from './novo.module.css';

export default function NovaEmpresaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: '',
    industry: '',
    location: 'Manaus-AM',
    size: '',
    website: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login?redirectedFrom=/empresas/novo');
        return;
      }

      const payload = {
        name: form.name,
        industry: form.industry || null,
        location: form.location,
        size: form.size || null,
        website: form.website || null,
        description: form.description || null,
        created_by: user.id,
      };

      const { error: insertError } = await supabase.from('companies').insert([payload]);
      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => router.push('/empresas'), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao criar empresa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <BuildingIcon className={styles.icon} />
        <h1>Nova Empresa</h1>
        <p>Cadastre sua empresa na comunidade</p>
      </div>

      {success && (
        <div className={styles.success}>
          <CheckCircle2Icon className={styles.iconSm} />
          Empresa criada com sucesso! Redirecionando...
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
          <label>Nome da Empresa *</label>
          <input
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Ex: Tech Solutions Ltda"
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>Indústria</label>
            <input
              value={form.industry}
              onChange={e => setForm({ ...form, industry: e.target.value })}
              placeholder="Ex: Tecnologia"
            />
          </div>
          <div className={styles.field}>
            <label>Tamanho</label>
            <select value={form.size} onChange={e => setForm({ ...form, size: e.target.value })}>
              <option value="">Selecione</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="201+">201+</option>
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <label>Localização</label>
          <input
            value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
          />
        </div>

        <div className={styles.field}>
          <label>Website</label>
          <input
            type="url"
            value={form.website}
            onChange={e => setForm({ ...form, website: e.target.value })}
            placeholder="https://..."
          />
        </div>

        <div className={styles.field}>
          <label>Descrição</label>
          <textarea
            rows={5}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Descreva sua empresa..."
          />
        </div>

        <button type="submit" disabled={loading} className={styles.submit}>
          <SaveIcon className={styles.iconSm} />
          {loading ? 'Salvando...' : 'Cadastrar Empresa'}
        </button>
      </form>
    </div>
  );
}
