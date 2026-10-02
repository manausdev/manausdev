'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/infrastructure/supabase/client';
import type { Database } from '@/types/database';
import { BriefcaseIcon, SaveIcon, AlertCircleIcon, CheckCircle2Icon } from '@/components/icons';
import styles from './novo.module.css';

export default function NovaVagaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    company_name: '',
    type: 'CLT',
    remote: false,
    salary: '',
    link: '',
    location: 'Manaus-AM',
    skills: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login?redirectedFrom=/vagas/novo');
        return;
      }

      const payload: Database['public']['Tables']['jobs']['Insert'] = {
        title: form.title,
        description: form.description || null,
        company_name: form.company_name || null,
        type: form.type,
        remote: form.remote,
        salary: form.salary || null,
        link: form.link || null,
        location: form.location,
        skills: form.skills ? form.skills.split(',').map(s => s.trim()) : [],
        posted_by: user.id,
      };

      const { error: insertError } = await supabase.from('jobs').insert([payload]);
      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => router.push('/vagas'), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao criar vaga');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <BriefcaseIcon className={styles.icon} />
        <h1>Nova Vaga</h1>
        <p>Cadastre uma oportunidade para a comunidade</p>
      </div>

      {success && (
        <div className={styles.success}>
          <CheckCircle2Icon className={styles.iconSm} />
          Vaga criada com sucesso! Redirecionando...
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
          <label>Título da Vaga *</label>
          <input
            required
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Ex: Desenvolvedor Frontend"
          />
        </div>

        <div className={styles.field}>
          <label>Empresa</label>
          <input
            value={form.company_name}
            onChange={e => setForm({ ...form, company_name: e.target.value })}
            placeholder="Nome da empresa"
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>Tipo de Contrato</label>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option>CLT</option>
              <option>PJ</option>
              <option>Estágio</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Localização</label>
            <input
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label>Salário</label>
          <input
            value={form.salary}
            onChange={e => setForm({ ...form, salary: e.target.value })}
            placeholder="Ex: R$ 5.000 - 7.000"
          />
        </div>

        <div className={styles.field}>
          <label>Link de Candidatura</label>
          <input
            type="url"
            value={form.link}
            onChange={e => setForm({ ...form, link: e.target.value })}
            placeholder="https://..."
          />
        </div>

        <div className={styles.field}>
          <label>Habilidades (separadas por vírgula)</label>
          <input
            value={form.skills}
            onChange={e => setForm({ ...form, skills: e.target.value })}
            placeholder="React, Next.js, TypeScript"
          />
        </div>

        <div className={styles.field}>
          <label>Descrição</label>
          <textarea
            rows={5}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Descreva a vaga..."
          />
        </div>

        <div className={styles.checkbox}>
          <input
            type="checkbox"
            id="remote"
            checked={form.remote}
            onChange={e => setForm({ ...form, remote: e.target.checked })}
          />
          <label htmlFor="remote">100% Remoto</label>
        </div>

        <button type="submit" disabled={loading} className={styles.submit}>
          <SaveIcon className={styles.iconSm} />
          {loading ? 'Salvando...' : 'Publicar Vaga'}
        </button>
      </form>
    </div>
  );
}
