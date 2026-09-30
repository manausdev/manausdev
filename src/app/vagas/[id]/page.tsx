import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  BriefcaseIcon, 
  MapPinIcon, 
  DollarSignIcon, 
  ExternalLinkIcon, 
  BuildingIcon, 
  CheckCircle2Icon, 
  ClockIcon 
} from '@/components/icons';
import { MOCK_JOBS } from '@/lib/data/mock';
import { fetchById, fetchIdsForStaticParams } from '@/lib/data/source';
import type { Job } from '@/types/database';

export async function generateStaticParams() {
  return fetchIdsForStaticParams(
    'jobs',
    MOCK_JOBS.map((j) => j.id)
  );
}

interface JobDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const job = await fetchById<Job>('jobs', id, () => MOCK_JOBS.find((j) => j.id === id));

  if (!job) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description || job.title,
    datePosted: job.created_at,
    employmentType: job.type === 'CLT' ? 'FULL_TIME' : job.type === 'PJ' ? 'CONTRACTOR' : 'OTHER',
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company_name || 'Não informado',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location || 'Não informado',
        addressRegion: 'AM',
        addressCountry: 'BR',
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/vagas"
        className="inline-flex items-center gap-2 text-xs font-semibold text-accent-text hover:text-ink transition-colors mb-8"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Voltar para o mural de vagas
      </Link>

      <div className="manaus-card p-6 sm:p-10 border border-border space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-border">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip-leaf text-xs font-mono font-semibold">
                {job.type}
              </span>
              {job.remote && (
                <span className="chip-river text-xs font-mono font-semibold">
                  100% Remoto
                </span>
              )}
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-4xl text-ink">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-faint">
              <span className="flex items-center gap-1.5 font-medium text-ink">
                <BuildingIcon className="w-4 h-4 text-accent-text" />
                {job.company_name || 'Empresa não informada'}
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <MapPinIcon className="w-4 h-4 text-accent-text" />
                {job.location || 'Local não informado'}
              </span>
              {job.salary && (
                <span className="flex items-center gap-1.5 font-semibold text-accent-text font-mono">
                  <DollarSignIcon className="w-4 h-4" />
                  {job.salary}
                </span>
              )}
            </div>
          </div>

          {job.link && (
            <div className="flex-shrink-0">
              <a
                href={job.link}
                target="_blank"
                rel="noreferrer"
                className="btn-primary !py-3 !px-6 text-xs flex items-center gap-2 shadow-md w-full sm:w-auto justify-center"
              >
                <span>Candidatar-se Agora</span>
                <ExternalLinkIcon className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xs font-mono uppercase tracking-wider text-faint font-semibold mb-3">
            Descrição da Posição
          </h2>
          <p className="text-sm sm:text-base text-ink leading-relaxed whitespace-pre-line">
            {job.description || 'Estamos em busca de profissionais talentosos para compor nosso time.'}
          </p>
        </div>

        {job.skills && job.skills.length > 0 && (
          <div>
            <h2 className="text-xs font-mono uppercase tracking-wider text-faint font-semibold mb-3">
              Competências & Tecnologias Requeridas
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, i) => (
                <span key={i} className="chip-river text-xs !py-1 !px-3 font-mono font-semibold">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-faint">
          <span className="flex items-center gap-1.5">
            <ClockIcon className="w-4 h-4 text-accent-text" />
            Vaga ativa na comunidade ManausDev
          </span>
          {job.link && (
            <a
              href={job.link}
              target="_blank"
              rel="noreferrer"
              className="text-accent-text font-bold hover:underline"
            >
              Acessar portal da empresa →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}