import Link from 'next/link';
import { 
  ArrowRightIcon, 
  MapPinIcon, 
  CalendarDaysIcon as CalendarIcon, 
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

export default async function HomePage() {
  let devs = MOCK_DEVS;
  let projects = MOCK_PROJECTS;
  let events = MOCK_EVENTS;
  let jobs = MOCK_JOBS;

  let devsCount = MOCK_DEVS.length;
  let projectsCount = MOCK_PROJECTS.length;
  let communitiesCount = MOCK_COMMUNITIES.length;
  let jobsCount = MOCK_JOBS.length;

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
      jobsCountRes
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

    if (devsRes.data && devsRes.data.length > 0) devs = devsRes.data;
    if (projectsRes.data && projectsRes.data.length > 0) projects = projectsRes.data;
    if (eventsRes.data && eventsRes.data.length > 0) events = eventsRes.data;
    if (jobsRes.data && jobsRes.data.length > 0) jobs = jobsRes.data;

    if (devsCountRes.count) devsCount = devsCountRes.count;
    if (projectsCountRes.count) projectsCount = projectsCountRes.count;
    if (communitiesCountRes.count) communitiesCount = communitiesCountRes.count;
    if (jobsCountRes.count) jobsCount = jobsCountRes.count;
  } catch {
    // Fallback to mock data
  }

  return (
    <div className="flex-grow flex flex-col relative z-10 overflow-x-clip">
      {/* Hero Section */}
      <section className="relative w-full pt-20 pb-32 flex items-center justify-center min-h-[80vh]">
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center absolute inset-0"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2000&auto=format&fit=crop')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-deep/95 via-deep/85 to-deep/60 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-9 flex flex-col gap-6 text-white">
            <div className="inline-flex items-center gap-2 bg-accent/40 backdrop-blur-md border border-accent/60 px-4 py-1.5 rounded-full w-max shadow-sm">
              <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
              <span className="text-xs font-semibold text-neon-text uppercase tracking-widest font-mono">
                Inovação Regional
              </span>
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl !text-white drop-shadow-md leading-[1.15] tracking-tight">
              A maior comunidade de tecnologia do Amazonas
            </h1>

            <p className="text-base sm:text-lg text-on-dark/90 max-w-2xl leading-relaxed">
              Quem constrói o futuro em Manaus está conectado aqui. Uma rede profissional focada em bioeconomia, inovação corporativa e engenharia de software de alta performance.
            </p>

            <div className="flex flex-col sm:flex-row gap-3.5 mt-2">
              <Link
                href="/devs"
                className="btn-leaf !py-3.5 !px-6 text-sm font-semibold shadow-md flex items-center justify-center gap-2"
              >
                Explorar Desenvolvedores
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link
                href="/projetos"
                className="inline-flex items-center justify-center gap-2 bg-transparent border border-neon text-neon-text hover:bg-neon/10 transition-colors px-6 py-3.5 rounded text-sm font-semibold"
              >
                Ver Projetos Locais
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Bar floating below hero */}
        <div className="absolute bottom-0 left-0 w-full transform translate-y-1/2 px-4 sm:px-6 lg:px-8 z-20">
          <div className="max-w-7xl mx-auto glass-card rounded-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-border-strong/30">
            <Link href="/devs" className="flex flex-col items-center justify-center text-center px-4 py-2 hover:opacity-80 transition-opacity">
              <span className="font-display font-bold text-3xl sm:text-4xl text-ink">{devsCount}+</span>
              <span className="text-xs font-semibold text-muted uppercase tracking-wider mt-1">Devs Cadastrados</span>
            </Link>
            <Link href="/projetos" className="flex flex-col items-center justify-center text-center px-4 py-2 hover:opacity-80 transition-opacity">
              <span className="font-display font-bold text-3xl sm:text-4xl text-accent-text">{projectsCount}+</span>
              <span className="text-xs font-semibold text-muted uppercase tracking-wider mt-1">Projetos Tech</span>
            </Link>
            <Link href="/comunidades" className="flex flex-col items-center justify-center text-center px-4 py-2 hover:opacity-80 transition-opacity">
              <span className="font-display font-bold text-3xl sm:text-4xl text-accent-text">{communitiesCount}+</span>
              <span className="text-xs font-semibold text-muted uppercase tracking-wider mt-1">Comunidades Ativas</span>
            </Link>
            <Link href="/vagas" className="flex flex-col items-center justify-center text-center px-4 py-2 hover:opacity-80 transition-opacity">
              <span className="font-display font-bold text-3xl sm:text-4xl text-ink">{jobsCount}+</span>
              <span className="text-xs font-semibold text-muted uppercase tracking-wider mt-1">Vagas no Amazonas</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Spacer for stats bar */}
      <div className="h-36 md:h-32 w-full bg-surface" />

      {/* Developers in Focus */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface relative bio-texture">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-3 border-b border-border-strong/30 pb-4">
            <div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink">Talentos do Norte</h2>
              <p className="text-sm text-muted mt-1.5">Conheça os profissionais que estão elevando o nível técnico da região.</p>
            </div>
            <Link
              href="/devs"
              className="text-xs font-semibold text-accent-text hover:text-ink transition-colors flex items-center gap-1"
            >
              Ver todos os devs <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {devs.slice(0, 4).map((dev, idx) => {
              const borderColors = ['border-accent', 'border-cyan', 'border-neon', 'border-brand-blue'];
              const borderClass = borderColors[idx % borderColors.length];

              return (
                <Link
                  href={`/devs/${dev.username}`}
                  key={dev.id}
                  className={`bg-surface rounded-xl p-6 border-t-4 ${borderClass} shadow-card-ambient hover:shadow-card-hover transition-all flex flex-col items-center text-center gap-4 relative group overflow-hidden border border-border`}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
                  <div className="w-24 h-24 rounded-full bg-deep text-white flex items-center justify-center font-display font-bold text-2xl border-2 border-border shadow-sm z-10">
                    {dev.full_name.charAt(0)}
                  </div>

                  <div className="z-10">
                    <h3 className="font-display font-bold text-base text-ink group-hover:text-accent-text transition-colors">{dev.full_name}</h3>
                    <p className="text-xs text-muted mt-0.5">{dev.role || 'Software Engineer'}</p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-1.5 mt-1 z-10">
                    {(dev.skills || []).slice(0, 3).map((skill, i) => (
                      <span key={i} className="chip-leaf text-[11px] !py-0.5 !px-2">
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface-1 relative">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink">
              Bioeconomia & Tech: Projetos Feitos no Amazonas
            </h2>
            <p className="text-sm text-muted mt-2">
              Soluções inovadoras desenvolvidas localmente com impacto global.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Feature Large */}
            <Link
              href={`/projetos/${projects[0]?.id || '1'}`}
              className="md:col-span-8 bg-deep rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative border border-border-strong/20 flex flex-col justify-end p-8 min-h-[320px]"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 opacity-25"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop')`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/80 to-transparent" />
              
              <div className="relative z-10 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-accent text-white px-2.5 py-1 rounded text-xs font-semibold inline-flex items-center gap-1 font-mono">
                    <Flower2Icon className="w-3.5 h-3.5" /> Feito em Manaus
                  </span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold mb-2">{projects[0]?.title || 'ManausHub'}</h3>
                <p className="text-sm text-white/90 max-w-lg mb-4 leading-relaxed line-clamp-2">
                  {projects[0]?.description || 'Plataforma open-source para mapeamento de startups e talentos do ecossistema local.'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {projects[0]?.stack?.map((st, i) => (
                    <span key={i} className="px-2.5 py-1 bg-surface/15 backdrop-blur-sm text-white text-xs font-mono rounded border border-white/20">
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            </Link>

            {/* Side Features */}
            <div className="md:col-span-4 flex flex-col gap-6">
              {projects.slice(1, 3).map((proj, idx) => (
                <Link
                  key={proj.id}
                  href={`/projetos/${proj.id}`}
                  className={`bg-surface rounded-xl p-6 shadow-sm border-l-4 ${idx === 0 ? 'border-l-cyan' : 'border-l-accent'} flex flex-col justify-between hover:translate-x-1 transition-transform border border-border`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-display font-bold text-base text-ink">{proj.title}</h3>
                      {idx === 0 ? <MapIcon className="w-5 h-5 text-accent-text" /> : <CompassIcon className="w-5 h-5 text-accent-text" />}
                    </div>
                    <p className="text-xs text-muted leading-relaxed mb-4 line-clamp-2">
                      {proj.description}
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="chip-leaf text-[10px] font-mono">{proj.stack?.[0] || 'Tech'}</span>
                    <span className="text-[11px] font-mono text-faint">Feito em Manaus</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events and Jobs (Side by Side) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Events */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-border-strong/30 pb-4 mb-2">
              <h2 className="font-display font-bold text-lg sm:text-xl text-ink flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-accent-text" />
                Próximos Eventos
              </h2>
              <Link href="/eventos" className="text-xs text-accent-text font-semibold hover:underline">
                Ver calendário
              </Link>
            </div>

            <ul className="flex flex-col gap-3.5">
              {events.slice(0, 3).map((ev) => {
                const dateParts = ev.date ? ev.date.split('-') : ['2026', '12', '15'];
                const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                const monthName = months[parseInt(dateParts[1] || '1', 10) - 1] || 'Dez';
                const dayNum = dateParts[2]?.slice(0, 2) || '15';

                return (
                  <li key={ev.id}>
                    <Link
                      href={`/eventos/${ev.id}`}
                      className="bg-surface-1 hover:bg-surface-2 p-4 rounded-lg flex items-center gap-4 transition-colors group border border-border block"
                    >
                      <div className="flex items-center gap-4 w-full">
                        <div className="bg-accent/10 text-ink p-3 rounded flex flex-col items-center justify-center min-w-[56px]">
                          <span className="text-[10px] font-bold uppercase font-mono">{monthName}</span>
                          <span className="font-display font-black text-lg">{dayNum}</span>
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-display font-bold text-sm text-ink group-hover:text-accent-text transition-colors">
                            {ev.title}
                          </h4>
                          <p className="text-xs text-muted mt-0.5 flex items-center gap-1">
                            <MapPinIcon className="w-3.5 h-3.5 text-accent-text" /> {ev.location}
                          </p>
                        </div>
                        <ChevronRightIcon className="w-4 h-4 text-faint group-hover:text-accent-text transition-colors flex-shrink-0" />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Jobs */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-border-strong/30 pb-4 mb-2">
              <h2 className="font-display font-bold text-lg sm:text-xl text-ink flex items-center gap-2">
                <BriefcaseIcon className="w-5 h-5 text-accent-text" />
                Vagas Recentes
              </h2>
              <Link href="/vagas" className="text-xs text-accent-text font-semibold hover:underline">
                Ver painel de vagas
              </Link>
            </div>

            <ul className="flex flex-col gap-3.5">
              {jobs.slice(0, 3).map((job) => (
                <li key={job.id}>
                  <Link
                    href={`/vagas/${job.id}`}
                    className="bg-surface p-4 rounded-lg border border-border shadow-sm hover:border-accent hover:shadow-md transition-all flex flex-col gap-2 group block"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-display font-bold text-sm text-ink group-hover:text-accent-text transition-colors">
                        {job.title}
                      </h4>
                      <span className="px-2 py-0.5 bg-surface-1 text-muted text-[11px] font-mono rounded">
                        {job.remote ? 'Remoto' : 'Presencial'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-xs text-faint">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-deep/10 flex items-center justify-center text-ink font-bold text-[10px]">
                          {(job.company_name || 'T').charAt(0)}
                        </div>
                        <span className="font-medium text-muted">{job.company_name || 'TechNorte'}</span>
                      </div>
                      <span className="font-mono text-[11px] text-accent-text font-semibold">
                        {job.salary || 'A combinar'}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-deep text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bio-texture" />
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-6 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-accent text-white flex items-center justify-center shadow-lg">
            <SparklesIcon className="w-6 h-6 text-neon-text" />
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl !text-white">
            Faça parte da história da tecnologia no Amazonas
          </h2>
          <p className="text-sm sm:text-base text-on-dark/85 max-w-xl">
            Junte-se a centenas de profissionais locais, compartilhe conhecimento e encontre sua próxima oportunidade.
          </p>
          <Link
            href="/auth/register"
            className="mt-2 btn-leaf !py-4 !px-8 text-base font-semibold shadow-lg border-b-4 border-accent w-full sm:w-auto"
          >
            Cadastrar meu perfil agora
          </Link>
        </div>
      </section>
    </div>
  );
}



