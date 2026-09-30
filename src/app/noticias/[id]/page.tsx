import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon, ClockIcon, UserIcon, MessageSquareIcon } from '@/components/icons';
import { MOCK_NEWS } from '@/lib/data/mock';
import { fetchById, fetchIdsForStaticParams } from '@/lib/data/source';
import { categoryLabel, formatDate } from '@/lib/news-meta';
import { siteUrl } from '@/lib/site';
import type { NewsItem } from '@/types/database';
import styles from './detail.module.css';

export async function generateStaticParams() {
  return fetchIdsForStaticParams(
    'news',
    MOCK_NEWS.map((n) => n.id)
  );
}

interface NewsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    alternates: {
      canonical: `/noticias/${id}`,
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { id } = await params;
  const item = await fetchById<NewsItem>('news', id, () => MOCK_NEWS.find((n) => n.id === id));

  if (!item) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: item.title,
    description: item.excerpt || item.title,
    url: siteUrl(`/noticias/${item.id}`),
    mainEntityOfPage: siteUrl(`/noticias/${item.id}`),
    datePublished: item.published_at ?? item.created_at,
    dateModified: item.updated_at ?? item.created_at,
    image: item.image_url ?? undefined,
    author: {
      '@type': 'Organization',
      name: 'ManausDev',
      url: siteUrl('/'),
    },
    publisher: {
      '@type': 'Organization',
      name: 'ManausDev',
      url: siteUrl('/'),
    },
  };

  return (
    <div className={styles.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/noticias" className={styles.backLink}>
        <ArrowLeftIcon className={styles.iconSm} />
        Voltar para as notícias
      </Link>

      <article className={styles.card}>
        {item.image_url && (
          <div className={styles.media}>
            <img src={item.image_url} alt="" className={styles.image} />
          </div>
        )}

        <div className={styles.body}>
          <div className={styles.badges}>
            <span className={styles.categoryBadge}>{categoryLabel(item.category)}</span>
            {item.published_at && (
              <span className={styles.dateBadge}>
                <ClockIcon className={styles.metaIcon} />
                {formatDate(item.published_at)}
              </span>
            )}
          </div>

          <h1 className={styles.title}>{item.title}</h1>

          {item.excerpt && <p className={styles.excerpt}>{item.excerpt}</p>}

          <div className={styles.byline}>
            <UserIcon className={styles.metaIcon} />
            Publicado pela comunidade ManausDev
          </div>

          <div className={styles.content}>
            {(item.content ?? item.excerpt ?? '').split('\n\n').map((paragraph, i) => (
              <p key={i} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <span className={styles.footerMeta}>
            <MessageSquareIcon className={styles.footerIcon} />
            Encontrou algo errado? Avise a curadoria pelo canal da comunidade.
          </span>
          <Link href="/noticias" className={styles.footerLink}>
            Mais notícias →
          </Link>
        </div>
      </article>
    </div>
  );
}
