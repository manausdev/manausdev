'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/infrastructure/supabase/client';
import type { NewsCategory } from '@/types/database';
import { MessageSquareIcon, SaveIcon, AlertCircleIcon, CheckCircle2Icon } from '@/components/icons';
import styles from './novo.module.css';

export default function NovaNoticiaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'geral' as NewsCategory,
    image_url: '',
    published: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login?redirectedFrom=/noticias/novo');
        return;
      }

      const payload = {
        title: form.title,
        excerpt: form.excerpt || null,
        content: form.content || null,
        category: form.category,
        image_url: form.image_url || null,
        published: form.published,
        published_at: form.published ? new Date().toISOString() : null,
        author_id: user.id,
      };

      const { error: insertError } = await supabase.from('news').insert([payload]);
      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => router.push('/noticias'), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao criar notícia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <MessageSquareIcon className={styles.icon} />
        <h1>Nova Notícia</h1>
        <p>Publique conteúdo para a comunidade</p>
      </div>

      {success && (
        <div className={styles.success}>
          <CheckCircle2Icon className={styles.iconSm} />
          Notícia criada com sucesso! Redirecionando...
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
          <label>Título *</label>
          <input
            required
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Ex: Novo hub de tecnologia em Manaus"
          />
        </div>

        <div className={styles.field}>
          <label>Categoria</label>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as NewsCategory })}>
            <option value="geral">Geral</option>
            <option value="evento">Evento</option>
            <option value="vaga">Vaga</option>
            <option value="lancamento">Lançamento</option>
            <option value="analise">Análise</option>
          </select>
        </div>

        <div className={styles.field}>
          <label>Imagem URL</label>
          <input
            type="url"
            value={form.image_url}
            onChange={e => setForm({ ...form, image_url: e.target.value })}
            placeholder="https://..."
          />
        </div>

        <div className={styles.field}>
          <label>Resumo</label>
          <textarea
            rows={3}
            value={form.excerpt}
            onChange={e => setForm({ ...form, excerpt: e.target.value })}
            placeholder="Resumo curto..."
          />
        </div>

        <div className={styles.field}>
          <label>Conteúdo</label>
          <textarea
            rows={8}
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            placeholder="Conteúdo completo..."
          />
        </div>

        <div className={styles.checkbox}>
          <input
            type="checkbox"
            id="published"
            checked={form.published}
            onChange={e => setForm({ ...form, published: e.target.checked })}
          />
          <label htmlFor="published">Publicar imediatamente</label>
        </div>

        <button type="submit" disabled={loading} className={styles.submit}>
          <SaveIcon className={styles.iconSm} />
          {loading ? 'Salvando...' : 'Publicar Notícia'}
        </button>
      </form>
    </div>
  );
}
