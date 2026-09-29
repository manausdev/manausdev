import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  SparklesIcon, 
  UsersIcon, 
  MessageSquareIcon, 
  ExternalLinkIcon 
} from '@/components/icons';
import { createClient } from '@/lib/supabase/server';
import { MOCK_COMMUNITIES } from '@/lib/data/mock';
import type { Community } from '@/types/database';

export async function generateStaticParams() {
  return MOCK_COMMUNITIES.map((comm) => ({
    id: comm.id,
  }));
}

interface CommunityDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CommunityDetailPage({ params }: CommunityDetailPageProps) {
  const { id } = await params;
  let community: Community | undefined = MOCK_COMMUNITIES.find((c) => c.id === id);

  try {
    const supabase = await createClient();
    const { data: commData } = await supabase
      .from('communities')
      .select('*')
      .eq('id', id)
      .single();

    if (commData) {
      community = commData;
    }
  } catch {
    // Fallback to mock
  }

  if (!community) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/comunidades"
        className="inline-flex items-center gap-2 text-xs font-semibold text-accent-text hover:text-ink transition-colors mb-8"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Voltar para a lista de comunidades
      </Link>

      <div className="manaus-card overflow-hidden border border-border mb-8">
        <div className="relative h-48 sm:h-60 w-full bg-deep overflow-hidden border-b border-border">
          {community.image_url ? (
            <img
              src={community.image_url}
              alt={community.name}
              className="w-full h-full object-cover opacity-90"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-brand p-4 text-center">
              <SparklesIcon className="w-16 h-16 text-neon/60 mb-2" />
            </div>
          )}
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-deep/90 backdrop-blur-md text-neon text-xs font-mono px-3 py-1.5 rounded-full border border-neon/30 font-semibold shadow-md flex items-center gap-1.5">
              <UsersIcon className="w-3.5 h-3.5 text-neon" />
              {community.members_count}+ membros
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-10 space-y-8">
          <div className="pb-6 border-b border-border">
            <span className="text-xs font-mono text-accent-text font-semibold uppercase tracking-wider">
              {community.type}
            </span>
            <h1 className="font-display font-bold text-2xl sm:text-4xl text-ink mt-1">
              {community.name}
            </h1>
          </div>

          <div>
            <h2 className="text-xs font-mono uppercase tracking-wider text-faint font-semibold mb-3">
              Missão e Propósito do Grupo
            </h2>
            <p className="text-sm sm:text-base text-ink leading-relaxed whitespace-pre-line max-w-3xl">
              {community.description}
            </p>
          </div>

          {community.links && Object.keys(community.links).length > 0 && (
            <div>
              <h2 className="text-xs font-mono uppercase tracking-wider text-faint font-semibold mb-3">
                Canais de Comunicação & Participação
              </h2>
              <div className="flex flex-wrap gap-3">
                {Object.entries(community.links).map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-1 hover:bg-accent/10 text-ink hover:text-accent-text border border-border hover:border-accent/30 transition-all font-semibold text-xs capitalize"
                  >
                    <MessageSquareIcon className="w-4 h-4 text-accent-text" />
                    <span>Entrar no {key}</span>
                    <ExternalLinkIcon className="w-3.5 h-3.5 opacity-60" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}