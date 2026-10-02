'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/infrastructure/supabase/client';
import styles from './callback.module.css';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleAuth() {
      try {
        const supabase = createClient();
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (session) {
          router.push('/dashboard');
        } else {
          router.push('/auth/login');
        }
      } catch (err) {
        console.error('Erro no callback de autenticação:', err);
        router.push('/auth/login?error=callback-failed');
      }
    }

    handleAuth();
  }, [router]);

  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      <p className={styles.message}>Autenticando na ManausDev...</p>
    </div>
  );
}
