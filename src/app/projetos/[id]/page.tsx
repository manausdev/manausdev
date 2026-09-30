import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeftIcon,
  Code2Icon,
  ExternalLinkIcon,
  StarIcon,
  ClockIcon,
} from '@/components/icons';
import { GithubIcon } from '@/components/icons';
import { MOCK_PROJECTS } from '@/lib/data/mock';
import { fetchById, fetchIdsForStaticParams } from '@/lib/data/source';
import type { Project } from '@/types/database';
import styles from './detail.module.css';

export async function generateStaticParams() {
  return fetchIdsForStaticParams(
    'projects',
    MOCK_PROJECTS.map((p) => p.id)
  );
}

interface ProjectDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const project = await fetchById<Project>('projects', id, () =>
    MOCK_PROJECTS.find((p) => p.id === id)
  );

  if (!project) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: project.title,
    description: project.description,
    dateCreated: project.created_at,
    programmingLanguage: project.stack || [],
    codeRepository: project.links?.github,
    url: project.links?.demo || project.links?.website,
  };

  return (
    <div className={styles.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/projetos" className={styles.backLink}>
        <ArrowLeftIcon className={styles.iconSm} />
        Voltar para o mural de projetos
      </Link>

      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.titleWrap}>
            <div className={styles.chips}>
              {project.featured && (
                <span className={styles.chipLeaf}>
                  <StarIcon className={styles.chipIcon} />
                  Destaque
                </span>
              )}
              <span className={styles.chipRiver}>
                🌿 Manaus Tech
              </span>
            </div>

            <h1 className={styles.title}>
              {project.title}
            </h1>
          </div>

          <div className={styles.actions}>
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noreferrer"
                className={styles.btnSecondary}
              >
                <GithubIcon className={styles.iconSm} />
                <span>Repositório</span>
              </a>
            )}
            {project.links?.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noreferrer"
                className={styles.btnPrimary}
              >
                <span>Ver Demo</span>
                <ExternalLinkIcon className={styles.iconSm} />
              </a>
            )}
          </div>
        </div>

        {project.image_url && (
          <div className={styles.imageWrap}>
            <img
              src={project.image_url}
              alt={project.title}
              className={styles.image}
            />
          </div>
        )}

        <div>
          <h2 className={styles.sectionLabel}>
            Sobre o Projeto
          </h2>
          <p className={styles.description}>
            {project.description}
          </p>
        </div>

        {project.stack && project.stack.length > 0 && (
          <div>
            <h2 className={styles.sectionLabel}>
              Stack & Tecnologias
            </h2>
            <div className={styles.stackWrap}>
              {project.stack.map((tech, i) => (
                <span key={i} className={styles.stackChip}>
                  <Code2Icon className={styles.stackChipIcon} />
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className={styles.footer}>
          <span className={styles.footerMeta}>
            <ClockIcon className={styles.footerIcon} />
            Projeto em destaque na comunidade ManausDev
          </span>
          {project.links?.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className={styles.footerLink}
            >
              Contribuir no GitHub →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}