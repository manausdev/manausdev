import Link from 'next/link';
import { 
  Users, 
  Code2, 
  Briefcase, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Terminal, 
  TrendingUp, 
  ExternalLink,
  MapPin,
  Calendar
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
    // Fallback to mock data silently
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background Cyber-Gradients */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-[#00F5FF]/15 via-[#818CF8]/10 to-[#10B981]/15 blur-3xl opacity-70" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300 mb-6 backdrop-blur-sm shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>A maior comunidade de tecnologia do Amazonas</span>
        </div>

        <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
          Quem constrói o futuro em <span className="gradient-text-cyber">Manaus</span> está conectado aqui.
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 mb-10 leading-relaxed">
          Descubra desenvolvedores de alto nível, colabore em projetos open-source regionais, acesse oportunidades no polo tecnológico e participe de encontros na Amazônia.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <Link
            href="/devs"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-[#00F5FF] text-[#00282B] hover:bg-[#5df7ff] shadow-glow-primary transition-all duration-200"
          >
            <Users className="w-4 h-4" />
            Explorar Desenvolvedores
          </Link>
          <Link
            href="/projetos"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-medium border border-white/15 bg-white/5 text-white hover:bg-white/10 transition-all duration-200"
          >
            <Code2 className="w-4 h-4 text-emerald-400" />
            Ver Projetos Locais
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-card p-5 text-center">
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-[#00F5FF]">450+</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Devs Cadastrados</div>
          </div>
          <div className="glass-card p-5 text-center">
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-[#10B981]">120+</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Projetos Tech</div>
          </div>
          <div className="glass-card p-5 text-center">
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-[#F59E0B]">18+</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Comunidades Ativas</div>
          </div>
          <div className="glass-card p-5 text-center">
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-[#818CF8]">50+</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Vagas no Amazonas</div>
          </div>
        </div>
      </section>

      {/* Featured Developers Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00F5FF] uppercase tracking-wider mb-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>Talentos do Norte</span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">Desenvolvedores em Destaque</h2>
          </div>
          <Link href="/devs" className="text-xs font-medium text-[#00F5FF] hover:underline inline-flex items-center gap-1 mt-2 sm:mt-0">
            Ver todos os desenvolvedores <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {devs.slice(0, 4).map((dev) => (
            <div key={dev.id} className="glass-card p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00F5FF]/20 to-[#10B981]/20 border border-white/10 flex items-center justify-center text-white font-bold font-mono">
                    {dev.full_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-white">{dev.full_name}</h3>
                    <p className="text-xs text-[#00F5FF]">{dev.role || 'Developer'}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                  {dev.bio || 'Membro da comunidade ManausDev.'}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(dev.skills || []).slice(0, 3).map((skill, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/5 text-slate-300 border border-white/10">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  {dev.location || 'Manaus-AM'}
                </span>
                {dev.github && (
                  <a href={dev.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                    <GithubIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#10B981] uppercase tracking-wider mb-2">
              <Code2 className="w-3.5 h-3.5" />
              <span>Bioeconomia & Tech</span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">Projetos Feitos no Amazonas</h2>
          </div>
          <Link href="/projetos" className="text-xs font-medium text-[#10B981] hover:underline inline-flex items-center gap-1 mt-2 sm:mt-0">
            Explorar todos os projetos <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.slice(0, 3).map((project) => (
            <div key={project.id} className="glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-display font-bold text-base text-white">{project.title}</h3>
                  <div className="px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[10px] font-mono">
                    Feito em Manaus
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {(project.stack || []).map((tech, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#00F5FF]/10 text-[#00F5FF] border border-[#00F5FF]/20">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/5 text-xs">
                {project.links?.github && (
                  <a href={project.links.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-300 hover:text-white">
                    <GithubIcon className="w-3.5 h-3.5" /> Código
                  </a>
                )}
                {project.links?.demo && (
                  <a href={project.links.demo} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#00F5FF] hover:underline ml-auto">
                    Demonstração <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Events & Opportunities Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Upcoming Events */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#F59E0B]" />
                Próximos Eventos
              </h2>
              <Link href="/eventos" className="text-xs text-amber-400 hover:underline">Ver agenda</Link>
            </div>
            <div className="space-y-3">
              {events.slice(0, 3).map((ev) => (
                <div key={ev.id} className="glass-surface p-4 rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">{ev.type}</span>
                    <h4 className="font-display font-semibold text-sm text-white mt-0.5">{ev.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" /> {ev.location}
                    </p>
                  </div>
                  {ev.link && (
                    <a href={ev.link} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-white hover:bg-white/10">
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
              <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#00F5FF]" />
                Vagas Recentes
              </h2>
              <Link href="/vagas" className="text-xs text-[#00F5FF] hover:underline">Ver todas</Link>
            </div>
            <div className="space-y-3">
              {jobs.slice(0, 3).map((job) => (
                <div key={job.id} className="glass-surface p-4 rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#00F5FF]/10 text-[#00F5FF] border border-[#00F5FF]/20">
                        {job.type}
                      </span>
                      {job.remote && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Remoto
                        </span>
                      )}
                    </div>
                    <h4 className="font-display font-semibold text-sm text-white mt-1">{job.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{job.company_name || 'Empresa Local'} • {job.salary || 'A combinar'}</p>
                  </div>
                  {job.link && (
                    <a href={job.link} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#00F5FF]/10 text-[#00F5FF] border border-[#00F5FF]/30 hover:bg-[#00F5FF]/20">
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
        <div className="glass-card p-10 sm:p-14 relative overflow-hidden">
          <div className="pointer-events-none absolute -bottom-20 -right-20 w-80 h-80 bg-[#00F5FF]/20 blur-3xl rounded-full" />
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-4">
            Faça parte da história da tecnologia no Amazonas.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8">
            Crie seu perfil profissional no ManausDev gratuitamente, exiba seus projetos e participe da nossa rede.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold bg-[#00F5FF] text-[#00282B] hover:bg-[#5df7ff] shadow-glow-primary transition-all duration-200"
          >
            <Sparkles className="w-4 h-4" />
            Cadastrar meu perfil agora
          </Link>
        </div>
      </section>
    </div>
  );
}
