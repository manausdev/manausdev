'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  MapPinIcon,
  GlobeIcon,
  ArrowLeftIcon,
  BriefcaseIcon,
  Code2Icon,
  CalendarDaysIcon,
  ClockIcon,
  UserXIcon,
} from '@/components/icons';
import { GithubIcon, LinkedinIcon } from '@/components/icons';
import { createClient } from '@/lib/supabase/client';
import { MOCK_DEVS, MOCK_PROJECTS, MOCK_EVENTS } from '@/lib/data/mock';
import { useMockData } from '@/lib/env';
import { seniorityLabel } from '@/lib/devs-meta';
import { AvailabilityChip } from '@/molecules/AvailabilityChip';
import type { Profile, Project, EventItem } from '@/types/database';
import styles from './dev-profile.module.css';

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
    const useMock = useMockData();

    if (useMock) {
      const mock = MOCK_DEVS.find((d) => d.username.toLowerCase() === username.toLowerCase());
      if (mock) {
        setDev(mock);
        setDevProjects(MOCK_PROJECTS.filter((p) => p.author_id === mock.id));
        setDevEvents(MOCK_EVENTS.filter((e) => e.organizer_id === mock.id));
        setMissing(false);
      } else {
        setMissing(true);
      }
      setLoading(false);
      return;
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
          setDevProjects(projectsData ?? []);
          setDevEvents(eventsData ?? []);
        } else {
          setMissing(true);
        }
      } catch {
        if (!cancelled) setMissing(true);
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
      <div className={styles.container}>
        <div className={`${styles.card} ${styles.skeletonCard}`}>
          <div className={styles.skeletonHead}>
            <div className={styles.skeletonAvatar} />
            <div className={styles.skeletonLines}>
              <div className={`${styles.skelLine} ${styles.skelName}`} />
              <div className={`${styles.skelLine} ${styles.skelW32}`} />
              <div className={`${styles.skelLine} ${styles.skelW40}`} />
            </div>
          </div>
          <div className={styles.skeletonBody}>
            <div className={`${styles.skelLine} ${styles.skelW24}`} />
            <div className={`${styles.skelLine} ${styles.skelText} ${styles.skelTextLg}`} />
            <div className={`${styles.skelLine} ${styles.skelText} ${styles.skelTextMd}`} />
          </div>
        </div>
      </div>
    );
  }

  if (missing || !dev) {
    return (
      <div className={styles.container}>
        <div className={`${styles.card} ${styles.missingCard}`}>
          <UserXIcon size="xl" className={styles.missingIcon} />
          <h1 className={styles.missingTitle}>Dev não encontrado</h1>
          <p className={styles.missingText}>
            O perfil <span className={styles.username}>@{username}</span> não existe ou
            foi removido do diretório.
          </p>
          <Link href="/devs" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnBack}`}>
            <ArrowLeftIcon />
            Voltar para o diretório
          </Link>
        </div>
      </div>
    );
  }

  const displayName = dev.full_name || dev.username;
  const seniority = seniorityLabel(dev.seniority);

  return (
    <div className={styles.container}>
      {/* Back button */}
      <Link href="/devs" className={styles.backLink}>
        <ArrowLeftIcon />
        Voltar para o diretório de desenvolvedores
      </Link>

      {/* Main Profile Card */}
      <div className={`${styles.card} ${styles.profileCard}`}>
        <div className={styles.head}>
          <div className={styles.identity}>
            <div className={styles.avatar}>
              {dev.avatar_url ? (
                <img src={dev.avatar_url} alt={displayName} className={styles.avatarImg} />
              ) : (
                displayName.charAt(0)
              )}
            </div>

            <div>
              <div className={styles.nameRow}>
                <h1 className={styles.name}>{displayName}</h1>
                <AvailabilityChip value={dev.availability} size="md" />
              </div>
              <p className={styles.handle}>@{dev.username}</p>
              <p className={styles.role}>
                {dev.role || 'Software Engineer'}
                {seniority ? ` · ${seniority}` : ''}
              </p>
            </div>
          </div>

          <div className={styles.actions}>
            {dev.github && (
              <a
                href={dev.github}
                target="_blank"
                rel="noreferrer"
                className={`${styles.btn} ${styles.btnSecondary}`}
              >
                <GithubIcon />
                <span>GitHub</span>
              </a>
            )}
            {dev.website && (
              <a
                href={dev.website}
                target="_blank"
                rel="noreferrer"
                className={`${styles.btn} ${styles.btnPrimary}`}
              >
                <GlobeIcon />
                <span>Website</span>
              </a>
            )}
            {dev.linkedin && (
              <a
                href={dev.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label={`LinkedIn de ${displayName}`}
                className={`${styles.btn} ${styles.btnSecondary}`}
              >
                <LinkedinIcon />
                <span>LinkedIn</span>
              </a>
            )}
          </div>
        </div>

        {/* Bio and Info */}
        <div className={styles.bioSection}>
          <div>
            <h2 className={styles.label}>Sobre o Profissional</h2>
            <p className={styles.bio}>
              {dev.bio || 'Membro da comunidade ManausDev construindo soluções no ecossistema tech do Amazonas.'}
            </p>
          </div>

          <div>
            <h2 className={`${styles.label} ${styles.labelLoose}`}>Tecnologias & Especialidades</h2>
            <div className={styles.tags}>
              {(dev.skills || []).map((skill, i) => (
                <span key={i} className={styles.skill}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <MapPinIcon className={styles.metaIcon} />
              {dev.city || dev.location || 'Manaus-AM'}
            </span>
            <span className={styles.metaItem}>
              <BriefcaseIcon className={styles.metaIcon} />
              {dev.role || 'Engenheiro de Software'}
            </span>
            <span className={styles.metaItem}>
              <Code2Icon className={styles.metaIcon} />
              {devProjects.length} {devProjects.length === 1 ? 'projeto' : 'projetos'}
            </span>
            <span className={styles.metaItem}>
              <CalendarDaysIcon className={styles.metaIcon} />
              {devEvents.length} {devEvents.length === 1 ? 'evento organizado' : 'eventos organizados'}
            </span>
            <span className={styles.metaItem}>
              <ClockIcon className={styles.metaIcon} />
              Membro desde {formatMemberSince(dev.created_at)}
            </span>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      {devProjects.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <Code2Icon size="md" className={styles.metaIcon} />
            <h2 className={styles.sectionTitle}>Projetos Publicados</h2>
          </div>

          <div className={styles.grid}>
            {devProjects.map((proj) => (
              <div key={proj.id} className={`${styles.card} ${styles.itemCard} ${styles.projectCard}`}>
                <div>
                  <h3 className={styles.itemTitle}>{proj.title}</h3>
                  <p className={styles.itemText}>{proj.description}</p>
                  <div className={styles.stack}>
                    {proj.stack?.map((s, i) => (
                      <span key={i} className={styles.stackTag}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <Link href={`/projetos/${proj.id}`} className={styles.detailLink}>
                  Ver detalhes do projeto →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Organized Events Section */}
      {devEvents.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <CalendarDaysIcon size="md" className={styles.metaIcon} />
            <h2 className={styles.sectionTitle}>Eventos Organizados</h2>
          </div>

          <div className={styles.grid}>
            {devEvents.map((event) => (
              <div key={event.id} className={`${styles.card} ${styles.itemCard}`}>
                <h3 className={styles.itemTitle}>{event.title}</h3>
                <p className={`${styles.itemText} ${styles.eventText}`}>{event.description}</p>
                <div className={styles.eventMeta}>
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
