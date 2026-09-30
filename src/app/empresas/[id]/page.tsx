import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  Building2Icon, 
  MapPinIcon, 
  GlobeIcon, 
  UsersIcon, 
  BriefcaseIcon, 
  ExternalLinkIcon 
} from '@/components/icons';
import { createClient } from '@/lib/supabase/server';
import { MOCK_COMPANIES, MOCK_JOBS } from '@/lib/data/mock';
import { fetchById, fetchIdsForStaticParams } from '@/lib/data/source';
import { useMockData } from '@/lib/env';
import type { Company, Job } from '@/types/database';

export async function generateStaticParams() {
  return fetchIdsForStaticParams(
    'companies',
    MOCK_COMPANIES.map((c) => c.id)
  );
}

interface CompanyDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const { id } = await params;
  const company = await fetchById<Company>('companies', id, () =>
    MOCK_COMPANIES.find((c) => c.id === id)
  );

  if (!company) {
    notFound();
  }

  let companyJobs: Job[] = [];

  if (useMockData()) {
    companyJobs = MOCK_JOBS.filter(
      (j) => j.company_name?.toLowerCase() === company.name.toLowerCase()
    );
  } else {
    try {
      const supabase = await createClient();
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('*')
        .eq('company_id', company.id);
      companyJobs = jobsData ?? [];
    } catch {
      companyJobs = [];
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/empresas"
        className="inline-flex items-center gap-2 text-xs font-semibold text-accent-text hover:text-ink transition-colors mb-8"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Voltar para o diretório de empresas
      </Link>

      <div className="manaus-card overflow-hidden border border-border mb-8">
        <div className="relative h-48 sm:h-64 w-full bg-deep overflow-hidden border-b border-border">
          {company.image_url ? (
            <img
              src={company.image_url}
              alt={company.name}
              className="w-full h-full object-cover opacity-85"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-brand p-4 text-center">
              <Building2Icon className="w-16 h-16 text-neon/60 mb-2" />
            </div>
          )}
          {company.size && (
            <div className="absolute top-4 right-4 z-10">
              <span className="bg-deep/90 backdrop-blur-md text-neon text-xs font-mono px-3 py-1.5 rounded-full border border-neon/30 font-semibold shadow-md flex items-center gap-1.5">
                <UsersIcon className="w-3.5 h-3.5 text-neon" />
                {company.size} colaboradores
              </span>
            </div>
          )}
        </div>

        <div className="p-6 sm:p-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border">
            <div className="flex items-center gap-4">
              {company.logo_url ? (
                <img
                  src={company.logo_url}
                  alt={`Logo ${company.name}`}
                  className="w-16 h-16 rounded-xl object-cover border border-border shadow-sm bg-surface"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-deep text-white flex items-center justify-center font-display font-bold text-2xl shadow-sm">
                  {company.name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink">
                  {company.name}
                </h1>
                <p className="text-xs sm:text-sm text-accent-text font-semibold mt-0.5">
                  {company.industry || 'Tecnologia e Inovação'}
                </p>
              </div>
            </div>

            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="btn-primary !py-2.5 !px-5 text-xs flex items-center gap-2"
              >
                <span>Acessar Website</span>
                <GlobeIcon className="w-4 h-4" />
              </a>
            )}
          </div>

          <div>
            <h2 className="text-xs font-mono uppercase tracking-wider text-faint font-semibold mb-3">
              Sobre a Empresa / Instituto
            </h2>
            <p className="text-sm sm:text-base text-ink leading-relaxed max-w-4xl">
              {company.description || 'Sem descrição cadastrada.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-6 pt-4 border-t border-border text-xs text-faint">
            <span className="flex items-center gap-1.5 font-mono">
              <MapPinIcon className="w-4 h-4 text-accent-text" />
              {company.location || 'Local não informado'}
            </span>
            <span className="flex items-center gap-1.5 font-mono">
              <Building2Icon className="w-4 h-4 text-accent-text" />
              {company.industry || 'Setor não informado'}
            </span>
          </div>
        </div>
      </div>

      {/* Vagas da Empresa */}
      {companyJobs.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-6">
            <BriefcaseIcon className="w-5 h-5 text-accent-text" />
            <h2 className="font-display font-bold text-xl text-ink">Vagas Abertas nesta Empresa</h2>
          </div>

          <div className="space-y-4">
            {companyJobs.map((job) => (
              <div key={job.id} className="manaus-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="chip-leaf text-xs font-mono">{job.type}</span>
                    {job.remote && <span className="chip-river text-xs font-mono">Remoto</span>}
                  </div>
                  <h3 className="font-display font-bold text-base text-ink">{job.title}</h3>
                  <p className="text-xs text-faint mt-1 font-mono">{job.salary || 'A combinar'}</p>
                </div>
                <Link
                  href={`/vagas/${job.id}`}
                  className="btn-leaf text-xs !py-2 !px-4 self-start sm:self-center"
                >
                  Ver detalhes da vaga →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}