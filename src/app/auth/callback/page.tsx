'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

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
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#00F5FF] border-r-transparent mb-4" />
      <p className="text-xs font-mono text-slate-400">Autenticando na ManausDev...</p>
    </div>
  );
}
