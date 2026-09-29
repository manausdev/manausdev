import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Code2,
  ExternalLink,
  Star,
  Clock,
} from 'lucide-react';
import { GithubIcon } from '@/components/icons';
import { createClient } from '@/lib/supabase/server';
import { MOCK_PROJECTS } from '@/lib/data/mock-data';
import type { Project } from '@/types/database';

export async function generateStaticParams() {
  return MOCK_PROJECTS.map((project) => ({
    id: project.id,
  }));
}

interface ProjectDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  let project: Project | undefined = MOCK_PROJECTS.find((p) => p.id === id);

  try {
    const supabase = await createClient();
    const { data: projectData } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (projectData) {
      project = projectData;
    }
  } catch {
    // Fallback to mock
  }

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/projetos"
        className="inline-flex items-center gap-2 text-xs font-semibold text-accent-text hover:text-ink transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para o mural de projetos
      </Link>

      <div className="manaus-card p-6 sm:p-10 border border-border space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-border">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {project.featured && (
                <span className="chip-leaf text-xs font-mono font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Destaque
                </span>
              )}
              <span className="chip-river text-xs font-mono font-semibold">
                🌿 Manaus Tech
              </span>
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-4xl text-ink">
              {project.title}
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary !py-3 !px-6 text-xs flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <GithubIcon className="w-4 h-4" />
                <span>Repositório</span>
              </a>
            )}
            {project.links?.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noreferrer"
                className="btn-primary !py-3 !px-6 text-xs flex items-center gap-2 shadow-md w-full sm:w-auto justify-center"
              >
                <span>Ver Demo</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {project.image_url && (
          <div className="relative h-56 sm:h-72 w-full rounded-xl overflow-hidden border border-border bg-deep">
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div>
          <h2 className="text-xs font-mono uppercase tracking-wider text-faint font-semibold mb-3">
            Sobre o Projeto
          </h2>
          <p className="text-sm sm:text-base text-ink leading-relaxed whitespace-pre-line">
            {project.description}
          </p>
        </div>

        {project.stack && project.stack.length > 0 && (
          <div>
            <h2 className="text-xs font-mono uppercase tracking-wider text-faint font-semibold mb-3">
              Stack & Tecnologias
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech, i) => (
                <span
                  key={i}
                  className="chip-river text-xs !py-1 !px-3 font-mono font-semibold"
                >
                  <Code2 className="w-3 h-3 inline-block mr-1" />
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-faint">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-accent-text" />
            Projeto em destaque na comunidade ManausDev
          </span>
          {project.links?.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className="text-accent-text font-bold hover:underline"
            >
              Contribuir no GitHub →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
