import Link from 'next/link';
import { 
  ArrowRightIcon, 
  MapPinIcon, 
  CalendarDaysIcon, 
  BriefcaseIcon, 
  SparklesIcon, 
  ChevronRightIcon,
  CompassIcon, 
  MapIcon, 
  Flower2Icon 
} from '@/components/icons';
import { createClient } from '@/infrastructure/supabase/server';
import { MOCK_PROJECTS, MOCK_EVENTS, MOCK_NEWS, MOCK_JOBS, MOCK_COMMUNITIES } from '@/lib/data/mock';
import { createDevelopersService } from '@/domains/developers/service';
import { createMockDevelopersRepository } from '@/domains/developers/repository';
import { createSupabaseDevelopersRepository } from '@/infrastructure/supabase/repositories/developers';
import { resolveList } from '@/lib/data/source';
import { buildAgenda, agendaDay } from '@/lib/agenda';
import { categoryLabel } from '@/lib/news-meta';
import { useMockData } from '@/lib/env';
import styles from './page.module.css';

export default async function HomePage() {
  const useMock = useMockData();
  const mockDevelopers = createDevelopersService(createMockDevelopersRepository());

  let devs = useMock ? await mockDevelopers.featured(4) : [];
  let projects = useMock ? MOCK_PROJECTS.slice(0, 3) : [];
  let events = useMock ? MOCK_EVENTS : [];
  let news = useMock ? MOCK_NEWS : [];
  let jobs = useMock ? MOCK_JOBS.slice(0, 3) : [];

  let devsCount = useMock ? await mockDevelopers.count() : 0;
  let projectsCount = useMock ? MOCK_PROJECTS.length : 0;
  let communitiesCount = useMock ? MOCK_COMMUNITIES.length : 0;
  let jobsCount = useMock ? MOCK_JOBS.length : 0;

  if (!useMock) {
    try {
      const supabase = await createClient();
      const developersService = createDevelopersService(
        createSupabaseDevelopersRepository(supabase)
      );
      const [
        featuredDevs,
        devsTotal,
        projectsRes,
        eventsRes,
        newsRes,
        jobsRes,
        projectsCountRes,
        communitiesCountRes,
        jobsCountRes,
      ] = await Promise.all([
        developersService.featured(4),
        developersService.count(),
        supabase.from('projects').select('*').limit(3),
        supabase.from('events').select('*').order('date', { ascending: true }).limit(6),
        supabase
          .from('news')
          .select('*')
          .eq('published', true)
          .order('published_at', { ascending: false })
          .limit(6),
        supabase.from('jobs').select('*').limit(3),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('communities').select('*', { count: 'exact', head: true }),
        supabase.from('jobs').select('*', { count: 'exact', head: true }),
      ]);

      devs = resolveList([], featuredDevs);
      projects = resolveList([], projectsRes.data);
      events = resolveList([], eventsRes.data);
      news = resolveList([], newsRes.data);
      jobs = resolveList([], jobsRes.data);

      devsCount = devsTotal;
      projectsCount = projectsCountRes.count ?? 0;
      communitiesCount = communitiesCountRes.count ?? 0;
      jobsCount = jobsCountRes.count ?? 0;
    } catch {
      // Keep empty lists — never invent production content
    }
  }

  const agenda = buildAgenda(news, events, (item) => categoryLabel(item.category), 6);

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
                  <div className={styles.devAvatar}>
                    {dev.avatar_url ? (
                      <img
                        src={dev.avatar_url}
                        alt=""
                        className={styles.devAvatarImg}
                      />
                    ) : (
                      dev.full_name.charAt(0)
                    )}
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
      {/* Sem projetos reais, a seção some: nunca inventamos conteúdo em produção. */}
      {projects.length > 0 && (
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
                href={`/projetos/${projects[0].id}`}
                className={`${styles.projectFeatureLink} ${
                  projects.length > 1 ? styles.projectFeature : styles.projectFeatureFull
                }`}
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
                  <h3 className={styles.projectFeatureTitle}>{projects[0].title}</h3>
                  <p className={styles.projectFeatureDesc}>
                    {projects[0].description}
                  </p>
                  <div className={styles.projectFeatureStack}>
                    {projects[0].stack?.map((st, i) => (
                      <span key={i} className={styles.projectStackChip}>
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>

              {/* Side Features: sem projetos laterais, o div fica vazio e ainda
                  reserva a coluna de span 4, criando uma faixa em branco. */}
              {projects.length > 1 && (
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
                      <span className={styles.projectSideNote}>Feito em Manaus</span>
                    </div>
                  </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Notícias e Eventos: uma agenda só, em ordem cronológica */}
      {agenda.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Notícias e Eventos</h2>
                <p className={styles.sectionSubtitle}>
                  O que está acontecendo no ecossistema de tecnologia do Amazonas.
                </p>
              </div>
              <div className={styles.agendaLinks}>
                <Link href="/noticias" className={styles.viewAllLink}>
                  Notícias <ArrowRightIcon size="xs" />
                </Link>
                <Link href="/eventos" className={styles.viewAllLink}>
                  Eventos <ArrowRightIcon size="xs" />
                </Link>
              </div>
            </div>

            <ul className={styles.agendaList}>
              {agenda.map((item) => (
                <li key={`${item.kind}-${item.id}`}>
                  <Link href={item.href} className={styles.agendaItem}>
                    <div className={styles.agendaDate}>
                      <span className={styles.agendaDay}>{agendaDay(item.date)}</span>
                    </div>

                    <div className={styles.agendaBody}>
                      <div className={styles.agendaBadges}>
                        <span
                          className={`${styles.agendaKind} ${
                            item.kind === 'evento' ? styles.agendaKindEvent : styles.agendaKindNews
                          }`}
                        >
                          {item.kind === 'evento' ? <CalendarDaysIcon size="xxs" /> : <SparklesIcon size="xxs" />}
                          {item.label}
                        </span>
                      </div>
                      <h3 className={styles.agendaTitle}>{item.title}</h3>
                      {item.meta && (
                        <p className={styles.agendaMeta}>
                          {item.kind === 'evento' && <MapPinIcon size="xxs" />}
                          {item.meta}
                        </p>
                      )}
                    </div>

                    <ChevronRightIcon className={styles.chevronIcon} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Jobs */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>
                <BriefcaseIcon className={styles.sideTitleIcon} />
                Vagas Recentes
              </h2>
              <p className={styles.sectionSubtitle}>
                Oportunidades abertas para profissionais da região.
              </p>
            </div>
            <Link href="/vagas" className={styles.viewAllLink}>
              Ver painel de vagas <ArrowRightIcon size="xs" />
            </Link>
          </div>

          <div className={styles.jobsList}>
            {jobs.slice(0, 3).map((job) => (
              <div key={job.id}>
                <Link href={`/vagas/${job.id}`} className={styles.jobItem}>
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
              </div>
            ))}
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