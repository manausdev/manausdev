import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  Building2Icon, 
  MapPinIcon, 
  GlobeIcon, 
  UsersIcon, 
  BriefcaseIcon 
} from '@/components/icons';
import { createPublicClient } from '@/lib/supabase/public';
import { MOCK_COMPANIES, MOCK_JOBS } from '@/lib/data/mock';
import { fetchById, fetchIdsForStaticParams } from '@/lib/data/source';
import { useMockData } from '@/lib/env';
import type { Company, Job } from '@/types/database';
import styles from './detail.module.css';

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

export async function generateMetadata({ params }: CompanyDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    alternates: {
      canonical: `/empresas/${id}`,
    },
  };
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
      const supabase = createPublicClient();
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
    <div className={styles.container}>
      <Link href="/empresas" className={styles.backLink}>
        <ArrowLeftIcon className={styles.iconSm} />
        Voltar para o diretório de empresas
      </Link>

      <div className={styles.card}>
        <div className={styles.heroImage}>
          {company.image_url ? (
            <img
              src={company.image_url}
              alt={company.name}
              className={styles.heroImg}
            />
          ) : (
            <div className={styles.heroFallback}>
              <Building2Icon className={styles.heroFallbackIcon} />
            </div>
          )}
          {company.size && (
            <div className={styles.sizeBadgeWrap}>
              <span className={styles.sizeBadge}>
                <UsersIcon className={styles.sizeBadgeIcon} />
                {company.size} colaboradores
              </span>
            </div>
          )}
        </div>

        <div className={styles.body}>
          <div className={styles.headerRow}>
            <div className={styles.idRow}>
              {company.logo_url ? (
                <img
                  src={company.logo_url}
                  alt={`Logo ${company.name}`}
                  className={styles.logoImg}
                />
              ) : (
                <div className={styles.logoFallback}>
                  {company.name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className={styles.name}>
                  {company.name}
                </h1>
                <p className={styles.industry}>
                  {company.industry || 'Tecnologia e Inovação'}
                </p>
              </div>
            </div>

            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className={styles.btnPrimary}
              >
                <span>Acessar Website</span>
                <GlobeIcon className={styles.iconSm} />
              </a>
            )}
          </div>

          <div>
            <h2 className={styles.sectionLabel}>
              Sobre a Empresa / Instituto
            </h2>
            <p className={styles.description}>
              {company.description || 'Sem descrição cadastrada.'}
            </p>
          </div>

          <div className={styles.metaRow}>
            <span className={styles.metaItem}>
              <MapPinIcon className={styles.metaIcon} />
              {company.location || 'Local não informado'}
            </span>
            <span className={styles.metaItem}>
              <Building2Icon className={styles.metaIcon} />
              {company.industry || 'Setor não informado'}
            </span>
          </div>
        </div>
      </div>

      {companyJobs.length > 0 && (
        <div className={styles.jobsSection}>
          <div className={styles.jobsHeading}>
            <BriefcaseIcon className={styles.jobsHeadingIcon} />
            <h2 className={styles.jobsTitle}>Vagas Abertas nesta Empresa</h2>
          </div>

          <div className={styles.jobsList}>
            {companyJobs.map((job) => (
              <div key={job.id} className={styles.jobCard}>
                <div>
                  <div className={styles.jobChips}>
                    <span className={styles.chipLeaf}>{job.type}</span>
                    {job.remote && <span className={styles.chipRiver}>Remoto</span>}
                  </div>
                  <h3 className={styles.jobTitle}>{job.title}</h3>
                  <p className={styles.jobSalary}>{job.salary || 'A combinar'}</p>
                </div>
                <Link
                  href={`/vagas/${job.id}`}
                  className={styles.btnLeaf}
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