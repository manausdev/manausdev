import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  MapPinIcon, 
  DollarSignIcon, 
  ExternalLinkIcon, 
  BuildingIcon, 
  ClockIcon 
} from '@/components/icons';
import { MOCK_JOBS } from '@/lib/data/mock';
import { fetchById, fetchIdsForStaticParams } from '@/lib/data/source';
import type { Job } from '@/types/database';
import styles from './detail.module.css';

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
    <div className={styles.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/vagas" className={styles.backLink}>
        <ArrowLeftIcon className={styles.iconSm} />
        Voltar para o mural de vagas
      </Link>

      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.titleWrap}>
            <div className={styles.chips}>
              <span className={styles.chipLeaf}>
                {job.type}
              </span>
              {job.remote && (
                <span className={styles.chipRiver}>
                  100% Remoto
                </span>
              )}
            </div>

            <h1 className={styles.title}>
              {job.title}
            </h1>

            <div className={styles.metaRow}>
              <span className={styles.metaItem}>
                <BuildingIcon className={styles.metaIcon} />
                {job.company_name || 'Empresa não informada'}
              </span>
              <span className={`${styles.metaItem} ${styles.metaItemMono}`}>
                <MapPinIcon className={styles.metaIcon} />
                {job.location || 'Local não informado'}
              </span>
              {job.salary && (
                <span className={styles.metaSalary}>
                  <DollarSignIcon className={styles.metaIcon} />
                  {job.salary}
                </span>
              )}
            </div>
          </div>

          {job.link && (
            <div className={styles.btnWrap}>
              <a
                href={job.link}
                target="_blank"
                rel="noreferrer"
                className={styles.btnPrimary}
              >
                <span>Candidatar-se Agora</span>
                <ExternalLinkIcon className={styles.iconSm} />
              </a>
            </div>
          )}
        </div>

        <div>
          <h2 className={styles.sectionLabel}>
            Descrição da Posição
          </h2>
          <p className={styles.description}>
            {job.description || 'Estamos em busca de profissionais talentosos para compor nosso time.'}
          </p>
        </div>

        {job.skills && job.skills.length > 0 && (
          <div>
            <h2 className={styles.sectionLabel}>
              Competências & Tecnologias Requeridas
            </h2>
            <div className={styles.stackWrap}>
              {job.skills.map((skill, i) => (
                <span key={i} className={styles.stackChip}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className={styles.footer}>
          <span className={styles.footerMeta}>
            <ClockIcon className={styles.footerIcon} />
            Vaga ativa na comunidade ManausDev
          </span>
          {job.link && (
            <a
              href={job.link}
              target="_blank"
              rel="noreferrer"
              className={styles.footerLink}
            >
              Acessar portal da empresa →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}