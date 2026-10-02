'use client';

import { useState, useEffect } from 'react';
import { ShieldIcon, SaveIcon, AlertCircleIcon, CheckCircle2Icon, UsersIcon } from '@/components/icons';
import { createClient } from '@/infrastructure/supabase/client';
import { PROFILE_TYPE_OPTIONS, profileType, isAdminProfile } from '@/lib/profile-types';
import type { Profile, ProfileType } from '@/types/database';
import styles from './AdminProfileTypes.module.css';

export interface AdminProfileTypesProps {
  /** Perfil de quem está logado; usado para decidir visibilidade e bloquear auto-edição. */
  viewer: Partial<Profile>;
}

interface AdminProfile {
  id: string;
  username: string;
  full_name: string;
  profile_type?: ProfileType | null;
  is_admin?: boolean | null;
}

/**
 * O postgrest-js lanca um `PostgrestError`, que e um objeto simples e nao uma
 * instancia de Error. Cair num `instanceof Error` trocaria a causa real — que
 * aqui quase sempre e RLS recusando a mudanca — por um texto generico, tirando
 * do admin justamente a informacao que ele precisa para agir.
 */
function errorText(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'message' in err) {
    const { message } = err as { message?: unknown };
    if (typeof message === 'string' && message.trim()) return message;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

export function AdminProfileTypes({ viewer }: AdminProfileTypesProps) {
  const [rows, setRows] = useState<AdminProfile[]>([]);
  const [pending, setPending] = useState<Record<string, ProfileType>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);

  const viewerIsAdmin = isAdminProfile(viewer.profile_type) || Boolean(viewer.is_admin);

  useEffect(() => {
    if (!viewerIsAdmin) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, full_name, profile_type, is_admin')
          .order('full_name', { ascending: true });
        if (error) throw error;
        setRows((data ?? []) as AdminProfile[]);
      } catch {
        setRows([]);
        setMessage({
          tone: 'error',
          text: 'Nao foi possivel carregar os perfis. Verifique as policies de leitura.',
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [viewerIsAdmin]);

  if (!viewerIsAdmin) return null;

  const handleSave = async (target: AdminProfile) => {
    const next = pending[target.id];
    if (!next || next === profileType(target.profile_type)) return;

    setSavingId(target.id);
    setMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('profiles')
        .update({ profile_type: next })
        .eq('id', target.id);
      if (error) throw error;

      setRows((current) =>
        current.map((row) => (row.id === target.id ? { ...row, profile_type: next } : row))
      );
      setPending((current) => {
        const { [target.id]: _removed, ...rest } = current;
        return rest;
      });
      setMessage({ tone: 'ok', text: `${target.full_name || target.username} agora é ${next}.` });
    } catch (err: unknown) {
      setMessage({ tone: 'error', text: errorText(err, 'Falha ao alterar o tipo de perfil.') });
    } finally {
      setSavingId(null);
    }
  };

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <span className={styles.kicker}>
            <ShieldIcon className={styles.kickerIcon} />
            Administração
          </span>
          <h2 className={styles.title}>Tipo de perfil dos membros</h2>
          <p className={styles.subtitle}>
            O tipo define o que cada conta pode publicar. Só um administrador altera esta coluna —
            o banco rejeita a mudança para os demais.
          </p>
        </div>
      </div>

      {message && (
        <div className={message.tone === 'ok' ? styles.bannerOk : styles.bannerError}>
          {message.tone === 'ok' ? (
            <CheckCircle2Icon className={styles.bannerIcon} />
          ) : (
            <AlertCircleIcon className={styles.bannerIcon} />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {loading ? (
        <p className={styles.loading}>Carregando membros...</p>
      ) : rows.length === 0 ? (
        <p className={styles.loading}>Nenhum perfil encontrado.</p>
      ) : (
        <ul className={styles.list}>
          {rows.map((row) => {
            const current = profileType(row.profile_type);
            const selected = pending[row.id] ?? current;
            const isSelf = row.id === viewer.id;
            const dirty = pending[row.id] !== undefined && pending[row.id] !== current;

            return (
              <li key={row.id} className={styles.row}>
                <div className={styles.identity}>
                  <UsersIcon className={styles.identityIcon} />
                  <div className={styles.identityText}>
                    <span className={styles.name}>
                      {row.full_name || row.username}
                      {isSelf && <span className={styles.youTag}>você</span>}
                    </span>
                    <span className={styles.username}>@{row.username}</span>
                  </div>
                </div>

                <div className={styles.controls}>
                  <select
                    value={selected}
                    disabled={isSelf || savingId === row.id}
                    onChange={(e) =>
                      setPending((current) => ({
                        ...current,
                        [row.id]: e.target.value as ProfileType,
                      }))
                    }
                    className={styles.select}
                    aria-label={`Tipo de perfil de ${row.full_name || row.username}`}
                  >
                    {PROFILE_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => handleSave(row)}
                    disabled={!dirty || savingId === row.id}
                    className={styles.saveBtn}
                  >
                    <SaveIcon className={styles.iconSm} />
                    {savingId === row.id ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
