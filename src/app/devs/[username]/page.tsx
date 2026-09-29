import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  MapPin, 
  Globe, 
  ArrowLeft, 
  CheckCircle2, 
  Briefcase, 
  Code2, 
  Mail,
  Share2
} from 'lucide-react';
import { GithubIcon } from '@/components/icons';
import { createClient } from '@/lib/supabase/server';
import { MOCK_DEVS, MOCK_PROJECTS } from '@/lib/data/mock-data';
import type { Profile, Project } from '@/types/database';

export async function generateStaticParams() {
  return MOCK_DEVS.map((dev) => ({
    username: dev.username,
  }));
}

interface DevDetailPageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function DevDetailPage({ params }: DevDetailPageProps) {
  const { username } = await params;
  let dev: Profile | undefined = MOCK_DEVS.find((d) => d.username.toLowerCase() === username.toLowerCase());
  let devProjects: Project[] = [];

  try {
    const supabase = await createClient();
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (profileData) {
      dev = profileData;
    }

    if (dev) {
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('author_id', dev.id);

      if (projectsData && projectsData.length > 0) {
        devProjects = projectsData;
      }
    }
  } catch {
    // Fallback to mock dev
  }

  if (!dev) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back button */}
      <Link
        href="/devs"
        className="inline-flex items-center gap-2 text-xs font-semibold text-accent-text hover:text-ink transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para o diretório de desenvolvedores
      </Link>

      {/* Main Profile Card */}
      <div className="manaus-card p-6 sm:p-10 mb-8 border border-border relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-border">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-deep text-white flex items-center justify-center font-display font-bold text-3xl border-4 border-border shadow-md flex-shrink-0">
              {dev.avatar_url ? (
                <img
                  src={dev.avatar_url}
                  alt={dev.full_name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                dev.full_name.charAt(0)
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink">
                  {dev.full_name}
                </h1>
                {dev.available ? (
                  <span className="chip-leaf text-xs font-mono font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Disponível
                  </span>
                ) : (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-surface-1 text-faint">
                    Ocupado
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-accent-text mt-0.5">@{dev.username}</p>
              <p className="text-xs sm:text-sm text-muted mt-1 font-medium">{dev.role || 'Software Engineer'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {dev.github && (
              <a
                href={dev.github}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary !py-2.5 !px-4 text-xs flex-1 sm:flex-initial justify-center"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            )}
            {dev.website && (
              <a
                href={dev.website}
                target="_blank"
                rel="noreferrer"
                className="btn-primary !py-2.5 !px-4 text-xs flex-1 sm:flex-initial justify-center"
              >
                <Globe className="w-4 h-4" />
                <span>Website</span>
              </a>
            )}
          </div>
        </div>

        {/* Bio and Info */}
        <div className="py-6 space-y-6">
          <div>
            <h2 className="text-xs font-mono uppercase tracking-wider text-faint font-semibold mb-2">
              Sobre o Profissional
            </h2>
            <p className="text-sm sm:text-base text-ink leading-relaxed max-w-3xl">
              {dev.bio || 'Membro da comunidade ManausDev construindo soluções no ecossistema tech do Amazonas.'}
            </p>
          </div>

          <div>
            <h2 className="text-xs font-mono uppercase tracking-wider text-faint font-semibold mb-3">
              Tecnologias & Especialidades
            </h2>
            <div className="flex flex-wrap gap-2">
              {(dev.skills || []).map((skill, i) => (
                <span key={i} className="chip-leaf text-xs !py-1 !px-3 font-semibold">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-4 border-t border-border text-xs text-faint">
            <span className="flex items-center gap-1.5 font-mono">
              <MapPin className="w-4 h-4 text-accent-text" />
              {dev.location || 'Manaus-AM'}
            </span>
            <span className="flex items-center gap-1.5 font-mono">
              <Briefcase className="w-4 h-4 text-accent-text" />
              {dev.role || 'Engenheiro de Software'}
            </span>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      {devProjects.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-6">
            <Code2 className="w-5 h-5 text-accent-text" />
            <h2 className="font-display font-bold text-xl text-ink">Projetos Publicados</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {devProjects.map((proj) => (
              <div key={proj.id} className="manaus-card p-6 border border-border flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-ink">{proj.title}</h3>
                  <p className="text-xs text-muted line-clamp-2 mt-1.5 mb-4">{proj.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.stack?.map((s, i) => (
                      <span key={i} className="chip-river text-[10px] font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  href={`/projetos/${proj.id}`}
                  className="text-xs font-semibold text-accent-text hover:underline flex items-center gap-1 mt-2"
                >
                  Ver detalhes do projeto →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

