import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * Cliente anônimo para leituras públicas em Server Components.
 *
 * Não usa `cookies()`: chamar essa API em uma rota com `generateStaticParams`
 * faz o Next lançar "Page changed from static to dynamic at runtime" e a página
 * responde 500 (mesmo para ids inexistentes, que deveriam dar 404). As tabelas
 * lidas por páginas de detalhe têm policy `for select using (true)`, então a
 * sessão do visitante não é necessária.
 *
 * Para leituras que dependem do usuário logado, use `./server`.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
