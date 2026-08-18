import Link from 'next/link';
import { 
  Users, 
  Code2, 
  Briefcase, 
  Sparkles, 
  ArrowRight, 
  Terminal, 
  ExternalLink,
  MapPin,
  Calendar,
  CheckCircle2,
  Building2,
  Compass
} from 'lucide-react';
import { GithubIcon } from '@/components/icons';
import { createClient } from '@/lib/supabase/server';
import { MOCK_DEVS, MOCK_PROJECTS, MOCK_EVENTS, MOCK_JOBS } from '@/lib/data/mock-data';

export default async function HomePage() {
  let devs = MOCK_DEVS;
  let projects = MOCK_PROJECTS;
  let events = MOCK_EVENTS;
  let jobs = MOCK_JOBS;

  try {
    const supabase = await createClient();
    const [devsRes, projectsRes, eventsRes, jobsRes] = await Promise.all([
      supabase.from('profiles').select('*').limit(4),
      supabase.from('projects').select('*').limit(3),
      supabase.from('events').select('*').order('date', { ascending: true }).limit(3),
      supabase.from('jobs').select('*').limit(3),
    ]);

    if (devsRes.data && devsRes.data.length > 0) devs = devsRes.data;
    if (projectsRes.data && projectsRes.data.length > 0) projects = projectsRes.data;
    if (eventsRes.data && eventsRes.data.length > 0) events = eventsRes.data;
    if (jobsRes.data && jobsRes.data.length > 0) jobs = jobsRes.data;
  } catch (err) {
    // Fallback to mock data
  }

  return (
    <div className="relative overflow-hidden bg-[#f7f9fb]">
      {/* Decorative Bio-Organic Leaf Path (Subtle 3-5% Opacity) */}
      <div className="pointer-events-none absolute -top-24 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#006c49]/5 via-[#00314a]/5 to-transparent rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-[500px] -left-20 w-[500px] h-[500px] bg-gradient-to-tr from-[#003527]/4 to-transparent rounded-full blur-3xl" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#006c49]/10 border border-[#006c49]/20 text-xs font-semibold text-[#006c49] mb-6 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-[#006c49] animate-pulse" />
          <span>Comunidade & Inovação Tecnológica no Amazonas</span>
        </div>

        <h1 className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[#003527] max-w-4xl mx-auto leading-[1.15] mb-6">
          Quem constrói o futuro em <span className="text-[#006c49]">Manaus</span> está conectado aqui.
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#404944] mb-10 leading-relaxed">
          Descubra engenheiros de software, colabore em projetos de bioeconomia e tecnologia, acesse oportunidades no Polo Industrial e participe de encontros na Amazônia.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <Link
            href="/devs"
            className="btn-primary w-full sm:w-auto !py-3.5 !px-6"
          >
            <Users className="w-4 h-4" />
            Explorar Desenvolvedores
          </Link>
          <Link
            href="/projetos"
            className="btn-secondary w-full sm:w-auto !py-3.5 !px-6"
          >
            <Code2 className="w-4 h-4 text-[#00314a]" />
            Ver Projetos Tech
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto">
          <div className="manaus-card p-6 text-center border-t-4 border-t-[#003527]">
            <div className="font-display font-bold text-3xl sm:text-4xl text-[#003527]">450+</div>
            <div className="text-xs text-[#404944] mt-1.5 font-medium">Devs Cadastrados</div>
          </div>
          <div className="manaus-card p-6 text-center border-t-4 border-t-[#006c49]">
            <div className="font-display font-bold text-3xl sm:text-4xl text-[#006c49]">120+</div>
            <div className="text-xs text-[#404944] mt-1.5 font-medium">Projetos & Startups</div>
          </div>
          <div className="manaus-card p-6 text-center border-t-4 border-t-[#00314a]">
            <div className="font-display font-bold text-3xl sm:text-4xl text-[#00314a]">18+</div>
            <div className="text-xs text-[#404944] mt-1.5 font-medium">Comunidades Ativas</div>
          </div>
          <div className="manaus-card p-6 text-center border-t-4 border-t-[#064e3b]">
            <div className="font-display font-bold text-3xl sm:text-4xl text-[#064e3b]">50+</div>
            <div className="text-xs text-[#404944] mt-1.5 font-medium">Vagas no Amazonas</div>
          </div>
        </div>
      </section>

      {/* Subtle River Path Separator */}
      <div className="max-w-7xl mx-auto px-8 my-4 flex items-center justify-center opacity-25">
        <svg width="100%" height="20" viewBox="0 0 1200 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 10 C 300 0, 600 20, 900 10 C 1050 5, 1150 15, 1200 10" stroke="#003527" strokeWidth="1.5" strokeDasharray="4 4"/>
        </svg>
      </div>

      {/* Featured Developers Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#006c49] font-semibold uppercase tracking-wider mb-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>Rede de Profissionais</span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#003527]">Desenvolvedores em Destaque</h2>
          </div>
          <Link href="/devs" className="text-sm font-semibold text-[#006c49] hover:underline inline-flex items-center gap-1 mt-2 sm:mt-0">
            Ver todos os desenvolvedores <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {devs.slice(0, 4).map((dev) => (
            <div key={dev.id} className="manaus-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#003527] text-white flex items-center justify-center font-display font-bold text-base shadow-sm">
                    {dev.full_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[#003527] leading-tight">{dev.full_name}</h3>
                    <p className="text-xs text-[#006c49] font-medium mt-0.5">{dev.role || 'Developer'}</p>
                  </div>
                </div>
                <p className="text-xs text-[#404944] line-clamp-3 mb-5 leading-relaxed">
                  {dev.bio || 'Profissional de tecnologia membro da comunidade ManausDev.'}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {(dev.skills || []).slice(0, 3).map((skill, i) => (
                    <span key={i} className="chip-leaf text-[11px] !py-0.5 !px-2">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-[#e0e3e5] flex items-center justify-between text-xs text-[#707974]">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-[#006c49]" />
                  {dev.location || 'Manaus-AM'}
                </span>
                {dev.github && (
                  <a href={dev.github} target="_blank" rel="noreferrer" className="text-[#404944] hover:text-[#003527] transition-colors">
                    <GithubIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#e0e3e5]/70">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#00314a] font-semibold uppercase tracking-wider mb-2">
              <Code2 className="w-3.5 h-3.5" />
              <span>Bioeconomia & Software</span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#003527]">Projetos Feitos no Amazonas</h2>
          </div>
          <Link href="/projetos" className="text-sm font-semibold text-[#00314a] hover:underline inline-flex items-center gap-1 mt-2 sm:mt-0">
            Explorar todos os projetos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.slice(0, 3).map((project) => (
            <div key={project.id} className="manaus-card p-6 flex flex-col justify-between border-t-4 border-t-[#00314a]">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-display font-bold text-lg text-[#003527]">{project.title}</h3>
                  <span className="chip-leaf text-[10px] font-mono">
                    Feito em Manaus 🌿
                  </span>
                </div>
                <p className="text-xs text-[#404944] leading-relaxed mb-5">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {(project.stack || []).map((tech, i) => (
                    <span key={i} className="chip-river text-[11px] font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#e0e3e5] text-xs">
                {project.links?.github && (
                  <a href={project.links.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[#404944] hover:text-[#003527] font-medium">
                    <GithubIcon className="w-4 h-4" /> Código
                  </a>
                )}
                {project.links?.demo && (
                  <a href={project.links.demo} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#00314a] hover:underline font-semibold ml-auto">
                    Demonstração <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Events & Jobs Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#e0e3e5]/70">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Upcoming Events */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl text-[#003527] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#006c49]" />
                Próximos Eventos
              </h2>
              <Link href="/eventos" className="text-xs text-[#006c49] font-semibold hover:underline">Ver agenda</Link>
            </div>
            <div className="space-y-3.5">
              {events.slice(0, 3).map((ev) => (
                <div key={ev.id} className="manaus-card p-5 flex items-center justify-between gap-4">
                  <div>
                    <span className="chip-river text-[10px] font-mono uppercase tracking-wider mb-1.5">{ev.type}</span>
                    <h4 className="font-display font-bold text-sm text-[#003527] mt-1">{ev.title}</h4>
                    <p className="text-xs text-[#404944] mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#006c49]" /> {ev.location}
                    </p>
                  </div>
                  {ev.link && (
                    <a href={ev.link} target="_blank" rel="noreferrer" className="btn-secondary text-xs !py-2 !px-3.5">
                      Participar
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Job Opportunities */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl text-[#003527] flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#00314a]" />
                Oportunidades de Emprego
              </h2>
              <Link href="/vagas" className="text-xs text-[#00314a] font-semibold hover:underline">Ver todas</Link>
            </div>
            <div className="space-y-3.5">
              {jobs.slice(0, 3).map((job) => (
                <div key={job.id} className="manaus-card p-5 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="chip-leaf text-[10px] font-mono">
                        {job.type}
                      </span>
                      {job.remote && (
                        <span className="chip-river text-[10px] font-mono">
                          100% Remoto
                        </span>
                      )}
                    </div>
                    <h4 className="font-display font-bold text-sm text-[#003527]">{job.title}</h4>
                    <p className="text-xs text-[#404944] mt-0.5">{job.company_name || 'Empresa do Polo'} • {job.salary || 'A combinar'}</p>
                  </div>
                  {job.link && (
                    <a href={job.link} target="_blank" rel="noreferrer" className="btn-primary text-xs !py-2 !px-3.5">
                      Candidatar
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Join Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="manaus-card bg-gradient-to-br from-[#003527] to-[#064e3b] text-white p-10 sm:p-14 relative overflow-hidden rounded-2xl shadow-elevated">
          <div className="pointer-events-none absolute -bottom-20 -right-20 w-80 h-80 bg-[#6cf8bb]/15 blur-3xl rounded-full" />
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
            Faça parte da história da tecnologia no Amazonas.
          </h2>
          <p className="text-sm sm:text-base text-[#80bea6] max-w-xl mx-auto mb-8 leading-relaxed">
            Crie seu perfil profissional no ManausDev gratuitamente, compartilhe seus projetos e participe da nossa rede.
          </p>
          <Link
            href="/auth/register"
            className="btn-leaf text-sm !py-3.5 !px-8 text-white !bg-[#006c49] hover:!bg-[#005236]"
          >
            <Sparkles className="w-4 h-4" />
            Cadastrar meu perfil agora
          </Link>
        </div>
      </section>
    </div>
  );
}
