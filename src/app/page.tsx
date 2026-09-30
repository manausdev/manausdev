import Link from 'next/link';
import { 
  ArrowRightIcon, 
  MapPinIcon, 
  CalendarDaysIcon, 
  BriefcaseIcon, 
  SparklesIcon, 
  ChevronRightIcon,
  Code2Icon, 
  CompassIcon, 
  MapIcon, 
  Flower2Icon 
} from '@/components/icons';
import { createClient } from '@/lib/supabase/server';
import { MOCK_DEVS, MOCK_PROJECTS, MOCK_EVENTS, MOCK_JOBS, MOCK_COMMUNITIES } from '@/lib/data/mock';
import { resolveList } from '@/lib/data/source';
import { useMockData } from '@/lib/env';
import styles from './page.module.css';

export default async function HomePage() {
  const useMock = useMockData();

  let devs = useMock ? MOCK_DEVS.slice(0, 4) : [];
  let projects = useMock ? MOCK_PROJECTS.slice(0, 3) : [];
  let events = useMock ? MOCK_EVENTS.slice(0, 3) : [];
  let jobs = useMock ? MOCK_JOBS.slice(0, 3) : [];

  let devsCount = useMock ? MOCK_DEVS.length : 0;
  let projectsCount = useMock ? MOCK_PROJECTS.length : 0;
  let communitiesCount = useMock ? MOCK_COMMUNITIES.length : 0;
  let jobsCount = useMock ? MOCK_JOBS.length : 0;

  if (!useMock) {
    try {
      const supabase = await createClient();
      const [
        devsRes,
        projectsRes,
        eventsRes,
        jobsRes,
        devsCountRes,
        projectsCountRes,
        communitiesCountRes,
        jobsCountRes,
      ] = await Promise.all([
        supabase.from('profiles').select('id, username, full_name, role, skills').limit(4),
        supabase.from('projects').select('*').limit(3),
        supabase.from('events').select('*').order('date', { ascending: true }).limit(3),
        supabase.from('jobs').select('*').limit(3),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('communities').select('*', { count: 'exact', head: true }),
        supabase.from('jobs').select('*', { count: 'exact', head: true }),
      ]);

      devs = resolveList([], devsRes.data);
      projects = resolveList([], projectsRes.data);
      events = resolveList([], eventsRes.data);
      jobs = resolveList([], jobsRes.data);

      devsCount = devsCountRes.count ?? 0;
      projectsCount = projectsCountRes.count ?? 0;
      communitiesCount = communitiesCountRes.count ?? 0;
      jobsCount = jobsCountRes.count ?? 0;
    } catch {
      // Keep empty lists — never invent production content
    }
  }

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div 
            className={styles.heroBgImage}
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2000&auto=format&fit=crop')`
            }}
          />
          <div className={styles.heroOverlay} />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroGrid}>
            <div className={styles.heroMain}>
              <div className={styles.badge}>
                <span className={styles.pulseDot} />
                <span className={styles.badgeText}>
                  Inovação Regional
                </span>
              </div>

              <h1 className={styles.heroTitle} style={{ color: '#ffffff' }}>
                A maior comunidade de tecnologia do Amazonas
              </h1>

              <p className={styles.heroSubtitle}>
                Quem constrói o futuro em Manaus está conectado aqui. Uma rede profissional focada em bioeconomia, inovação corporativa e engenharia de software de alta performance.
              </p>

              <div className={styles.heroActions}>
                <Link
                  href="/devs"
                  className={styles.heroPrimaryBtn}
                >
                  Explorar Desenvolvedores
                  <ArrowRightIcon />
                </Link>
                <Link
                  href="/projetos"
                  className={styles.heroSecondaryBtn}
                >
                  Ver Projetos Locais
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar floating below hero */}
        <div className={styles.statsBar}>
          <div className={styles.statsGrid}>
            <Link href="/devs" className={styles.statItem}>
              <span className={styles.statValue}>{devsCount}+</span>
              <span className={styles.statLabel}>Devs Cadastrados</span>
            </Link>
            <Link href="/projetos" className={styles.statItem}>
              <span className={styles.statValue}>{projectsCount}+</span>
              <span className={styles.statLabel}>Projetos Tech</span>
            </Link>
            <Link href="/comunidades" className={styles.statItem}>
              <span className={styles.statValue}>{communitiesCount}+</span>
              <span className={styles.statLabel}>Comunidades Ativas</span>
            </Link>
            <Link href="/vagas" className={styles.statItem}>
              <span className={styles.statValue}>{jobsCount}+</span>
              <span className={styles.statLabel}>Vagas no Amazonas</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Spacer for stats bar */}
      <div className={styles.statsSpacer} />

      {/* Developers in Focus */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Talentos do Norte</h2>
              <p className={styles.sectionSubtitle}>Conheça os profissionais que estão elevando o nível técnico da região.</p>
            </div>
            <Link
              href="/devs"
              className={styles.viewAllLink}
            >
              Ver todos os devs <ArrowRightIcon size="xs" />
            </Link>
          </div>

          <div className={styles.devGrid}>
            {devs.slice(0, 4).map((dev, idx) => {
              const borderColors = ['borderAccent', 'borderCyan', 'borderNeon', 'borderAccent'];
              const borderClass = styles[borderColors[idx % borderColors.length]];

              return (
                <Link
                  href={`/devs/${dev.username}`}
                  key={dev.id}
                  className={`${styles.devCard} ${borderClass}`}
                >
                  <div className={`${styles.devCard}::before`} />
                  
                  <div className={styles.devAvatar} aria-hidden="true">
                    {dev.full_name.charAt(0)}
                  </div>

                  <div className={styles.devInfo}>
                    <h3 className={styles.devName}>{dev.full_name}</h3>
                    <p className={styles.devRole}>{dev.role || 'Software Engineer'}</p>
                  </div>

                  <div className={styles.devSkills}>
                    {(dev.skills || []).slice(0, 3).map((skill, i) => (
                      <span key={i} className={`${styles.devSkillChip} ${styles.chipLeaf}`}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Regional Projects (Bento Grid Style) */}
      <section className={`${styles.section} ${styles.projectsSection}`}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionIntro}>
            <h2 className={styles.sectionTitle}>Bioeconomia & Tech: Projetos Feitos no Amazonas</h2>
            <p className={styles.sectionSubtitle}>
              Soluções inovadoras desenvolvidas localmente com impacto global.
            </p>
          </div>

          <div className={styles.projectsBento}>
            {/* Feature Large */}
            <Link
              href={`/projetos/${projects[0]?.id || '1'}`}
              className={styles.projectFeatureLink}
            >
              <div 
                className={styles.projectFeatureBg}
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop')`
                }}
              />
              <div className={styles.projectFeatureOverlay} />
              
              <div className={styles.projectFeatureContent}>
                <div className={styles.projectFeatureBadge}>
                  <span className={styles.projectFeatureBadgeInner}>
                    <Flower2Icon size="xs" /> Feito em Manaus
                  </span>
                </div>
                <h3 className={styles.projectFeatureTitle}>{projects[0]?.title || 'ManausHub'}</h3>
                <p className={styles.projectFeatureDesc}>
                  {projects[0]?.description || 'Plataforma open-source para mapeamento de startups e talentos do ecossistema local.'}
                </p>
                <div className={styles.projectFeatureStack}>
                  {projects[0]?.stack?.map((st, i) => (
                    <span key={i} className={styles.projectStackChip}>
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            </Link>

            {/* Side Features */}
            <div className={styles.projectsSide}>
              {projects.slice(1, 3).map((proj, idx) => (
                <Link
                  key={proj.id}
                  href={`/projetos/${proj.id}`}
                  className={`${styles.projectSideLink} ${idx === 0 ? styles.borderCyan : styles.borderAccent}`}
                >
                  <div>
                    <div className={styles.projectSideHeader}>
                      <h3 className={styles.projectSideTitle}>{proj.title}</h3>
                      {idx === 0 ? <MapIcon className={`${styles.projectSideIcon} ${styles.sideTitleIcon}`} /> : <CompassIcon className={`${styles.projectSideIcon} ${styles.sideTitleIcon}`} />}
                    </div>
                    <p className={styles.projectSideDesc}>
                      {proj.description}
                    </p>
                  </div>
                  <div className={styles.projectSideFooter}>
                    <span className={`${styles.chipLeaf} ${styles.projectSideChip}`}>{proj.stack?.[0] || 'Tech'}</span>
                    <span className={`${styles.projectSideNote} ${styles.sideNote}`}>Feito em Manaus</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events and Jobs (Side by Side) */}
      <section className={styles.section}>
        <div className={styles.sideBySide}>
          {/* Events */}
          <div className={styles.sideSection}>
            <div className={styles.sideHeader}>
              <h2 className={styles.sideTitle}>
                <CalendarDaysIcon className={`${styles.sideTitleIcon} ${styles.calendarIcon}`} />
                Próximos Eventos
              </h2>
              <Link href="/eventos" className={styles.viewAllSide}>
                Ver calendário
              </Link>
            </div>

            <ul className={styles.eventsList}>
              {events.slice(0, 3).map((ev) => {
                const dateParts = ev.date ? ev.date.split('-') : ['2026', '12', '15'];
                const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                const monthName = months[parseInt(dateParts[1] || '1', 10) - 1] || 'Dez';
                const dayNum = dateParts[2]?.slice(0, 2) || '15';

                return (
                  <li key={ev.id}>
                    <Link
                      href={`/eventos/${ev.id}`}
                      className={styles.eventItem}
                    >
                      <div className={styles.eventDate}>
                        <span className={styles.eventMonth}>{monthName}</span>
                        <span className={styles.eventDay}>{dayNum}</span>
                      </div>
                      <div className={styles.eventInfo}>
                        <h4 className={styles.eventTitle}>{ev.title}</h4>
                        <p className={styles.eventLocation}>
                          <MapPinIcon className={`${styles.mapPinIcon} ${styles.eventLocationIcon}`} /> {ev.location}
                        </p>
                      </div>
                      <ChevronRightIcon className={`${styles.chevronIcon} ${styles.chevronRight}`} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Jobs */}
          <div className={styles.sideSection}>
            <div className={styles.sideHeader}>
              <h2 className={styles.sideTitle}>
                <BriefcaseIcon className={styles.sideTitleIcon} />
                Vagas Recentes
              </h2>
              <Link href="/vagas" className={styles.viewAllSide}>
                Ver painel de vagas
              </Link>
            </div>

            <ul className={styles.jobsList}>
              {jobs.slice(0, 3).map((job) => (
                <li key={job.id}>
                  <Link
                    href={`/vagas/${job.id}`}
                    className={styles.jobItem}
                  >
                    <div className={styles.jobHeader}>
                      <h4 className={styles.jobTitle}>{job.title}</h4>
                      {job.remote && <span className={styles.jobRemote}>Remoto</span>}
                    </div>

                    <div className={styles.jobCompany}>
                      <div className={styles.jobCompanyAvatar}>
                        {(job.company_name || 'T').charAt(0)}
                      </div>
                      <span className={styles.jobCompanyName}>{job.company_name || 'TechNorte'}</span>
                    </div>

                    <div className={styles.jobDescription}>
                      {job.description}
                    </div>

                    {job.skills && job.skills.length > 0 && (
                      <div className={styles.jobSkills}>
                        {job.skills.map((s, i) => (
                          <span key={i} className={`${styles.jobSkillChip} ${styles.chipRiver}`}>
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBgTexture} />
        <div className={styles.ctaInner}>
          <div className={styles.ctaIcon}>
            <SparklesIcon className={styles.ctaIconInner} />
          </div>
          <h2 className={styles.ctaTitle}>
            Faça parte da história da tecnologia no Amazonas
          </h2>
          <p className={styles.ctaDesc}>
            Junte-se a centenas de profissionais locais, compartilhe conhecimento e encontre sua próxima oportunidade.
          </p>
          <Link
            href="/auth/register"
            className={styles.ctaBtn}
          >
            Cadastrar meu perfil agora
          </Link>
        </div>
      </section>
    </div>
  );
}