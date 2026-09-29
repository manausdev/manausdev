'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  MapPin,
  Globe,
  ArrowLeft,
  Briefcase,
  Code2,
  CalendarDays,
  Clock,
  UserX,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons';
import { createClient } from '@/lib/supabase/client';
import { MOCK_DEVS, MOCK_PROJECTS, MOCK_EVENTS } from '@/lib/data/mock-data';
import { availabilityMeta, seniorityLabel } from '@/lib/devs-meta';
import type { Profile, Project, EventItem } from '@/types/database';

function formatMemberSince(iso?: string): string {
  if (!iso) return 'recentemente';
  try {
    return new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })
      .format(new Date(iso))
      .replace('.', '');
  } catch {
    return 'recentemente';
  }
}

export default function DevProfileClient() {
  const params = useParams<{ username: string }>();
  const username = typeof params?.username === 'string' ? params.username : '';

  const [dev, setDev] = useState<Profile | null>(null);
  const [devProjects, setDevProjects] = useState<Project[]>([]);
  const [devEvents, setDevEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!username) return;
    let cancelled = false;

    const mock = MOCK_DEVS.find((d) => d.username.toLowerCase() === username.toLowerCase());
    if (mock) {
      setDev(mock);
      setDevProjects(MOCK_PROJECTS.filter((p) => p.author_id === mock.id));
      setDevEvents(MOCK_EVENTS.filter((e) => e.organizer_id === mock.id));
      setLoading(false);
    }

    (async () => {
      try {
        const supabase = createClient();
        const { data: profileData } = await supabase
          .from('profiles')
          .select(
            'id, username, full_name, avatar_url, role, bio, city, location, seniority, availability, skills, github, website, linkedin, is_admin, created_at, updated_at'
          )
          .eq('username', username)
          .single();

        if (cancelled) return;

        const profile = (profileData as unknown as Profile) || null;
        if (profile) {
          setDev(profile);
          setMissing(false);

          const [{ data: projectsData }, { data: eventsData }] = await Promise.all([
            supabase
              .from('projects')
              .select('id, title, description, stack')
              .eq('author_id', profile.id),
            supabase
              .from('events')
              .select('id, title, description, date, location')
              .eq('organizer_id', profile.id)
              .order('date', { ascending: false }),
          ]);

          if (cancelled) return;
          if (projectsData && projectsData.length > 0) setDevProjects(projectsData);
          if (eventsData && eventsData.length > 0) setDevEvents(eventsData);
        } else if (!mock) {
          setMissing(true);
        }
      } catch {
        if (!mock && !cancelled) setMissing(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [username]);

  if (loading && !dev) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="manaus-card p-6 sm:p-10 border border-border animate-pulse">
          <div className="flex items-center gap-5 pb-8 border-b border-border">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-surface-2" />
            <div className="space-y-3">
              <div className="h-6 w-48 bg-surface-2 rounded" />
              <div className="h-3 w-32 bg-surface-2 rounded" />
              <div className="h-3 w-40 bg-surface-2 rounded" />
            </div>
          </div>
          <div className="pt-6 space-y-4">
            <div className="h-3 w-24 bg-surface-2 rounded" />
            <div className="h-4 w-full max-w-2xl bg-surface-2 rounded" />
            <div className="h-4 w-full max-w-xl bg-surface-2 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (missing || !dev) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="manaus-card p-10 border border-border text-center">
          <UserX className="w-10 h-10 text-faint mx-auto mb-4" />
          <h1 className="font-display font-bold text-xl text-ink">Dev não encontrado</h1>
          <p className="text-sm text-muted mt-2">
            O perfil <span className="font-mono text-accent-text">@{username}</span> não existe ou
            foi removido do diretório.
          </p>
          <Link href="/devs" className="btn-primary inline-flex items-center gap-2 text-xs !py-2.5 !px-5 mt-6">
            <ArrowLeft className="w-4 h-4" />
            Voltar para o diretório
          </Link>
        </div>
      </div>
    );
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
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-deep text-white flex items-center justify-center font-display font-bold text-3xl border-4 border-border shadow-md flex-shrink-0 overflow-hidden">
              {dev.avatar_url ? (
                <img
                  src={dev.avatar_url}
                  alt={dev.full_name || dev.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                (dev.full_name || dev.username).charAt(0)
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink">
                  {dev.full_name || dev.username}
                </h1>
                {(() => {
                  const meta = availabilityMeta(dev.availability);
                  return (
                    <span className={`${meta.className} !text-xs flex items-center gap-1.5`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                      {meta.label}
                    </span>
                  );
                })()}
              </div>
              <p className="text-sm font-semibold text-accent-text mt-0.5">@{dev.username}</p>
              <p className="text-xs sm:text-sm text-muted mt-1 font-medium">
                {dev.role || 'Software Engineer'}
                {seniorityLabel(dev.seniority) ? ` · ${seniorityLabel(dev.seniority)}` : ''}
              </p>
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
            {dev.linkedin && (
              <a
                href={dev.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label={`LinkedIn de ${dev.full_name || dev.username}`}
                className="btn-secondary !py-2.5 !px-4 text-xs flex-1 sm:flex-initial justify-center"
              >
                <LinkedinIcon className="w-4 h-4" />
                <span>LinkedIn</span>
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
              {dev.city || dev.location || 'Manaus-AM'}
            </span>
            <span className="flex items-center gap-1.5 font-mono">
              <Briefcase className="w-4 h-4 text-accent-text" />
              {dev.role || 'Engenheiro de Software'}
            </span>
            <span className="flex items-center gap-1.5 font-mono">
              <Code2 className="w-4 h-4 text-accent-text" />
              {devProjects.length} {devProjects.length === 1 ? 'projeto' : 'projetos'}
            </span>
            <span className="flex items-center gap-1.5 font-mono">
              <CalendarDays className="w-4 h-4 text-accent-text" />
              {devEvents.length} {devEvents.length === 1 ? 'evento organizado' : 'eventos organizados'}
            </span>
            <span className="flex items-center gap-1.5 font-mono">
              <Clock className="w-4 h-4 text-accent-text" />
              Membro desde {formatMemberSince(dev.created_at)}
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

      {/* Organized Events Section */}
      {devEvents.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-6">
            <CalendarDays className="w-5 h-5 text-accent-text" />
            <h2 className="font-display font-bold text-xl text-ink">Eventos Organizados</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {devEvents.map((event) => (
              <div key={event.id} className="manaus-card p-6 border border-border">
                <h3 className="font-display font-bold text-base text-ink">{event.title}</h3>
                <p className="text-xs text-muted line-clamp-2 mt-1.5 mb-3">{event.description}</p>
                <div className="flex flex-wrap gap-4 text-[11px] font-mono text-faint">
                  <span>
                    {new Date(event.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <span>{event.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
