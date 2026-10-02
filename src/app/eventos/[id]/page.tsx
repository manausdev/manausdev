import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  CalendarDaysIcon, 
  MapPinIcon, 
  ExternalLinkIcon, 
  ClockIcon, 
  Share2Icon, 
  SparklesIcon 
} from '@/components/icons';
import { MOCK_EVENTS } from '@/lib/data/mock';
import { fetchById, fetchIdsForStaticParams } from '@/lib/data/source';
import { formatDate, safeUrl } from '@/lib/utils';
import type { EventItem } from '@/types/database';
import styles from './detail.module.css';

export async function generateStaticParams() {
  return fetchIdsForStaticParams(
    'events',
    MOCK_EVENTS.map((e) => e.id)
  );
}

interface EventDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    alternates: {
      canonical: `/eventos/${id}`,
    },
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const event = await fetchById<EventItem>('events', id, () =>
    MOCK_EVENTS.find((e) => e.id === id)
  );

  if (!event) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <Link href="/eventos" className={styles.backLink}>
        <ArrowLeftIcon />
        Voltar para a agenda de eventos
      </Link>

      <div className={styles.card}>
        <div className={styles.cover}>
          {event.image_url ? (
            <img src={event.image_url} alt={event.title} className={styles.coverImg} />
          ) : (
            <div className={styles.coverFallback}>
              <CalendarDaysIcon size="xxl" className={styles.coverFallbackIcon} />
            </div>
          )}
          <div className={styles.typeBadgeWrap}>
            <span className={styles.typeBadge}>{event.type}</span>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.header}>
            <div>
              <span className={styles.date}>📅 {formatDate(event.date)}</span>
              <h1 className={styles.title}>{event.title}</h1>
              <div className={styles.location}>
                <MapPinIcon className={styles.locationIcon} />
                <span>{event.location}</span>
              </div>
            </div>

            {safeUrl(event.link) && (
              <a href={safeUrl(event.link)!} target="_blank" rel="noreferrer" className={styles.cta}>
                <span>Garantir Inscrição</span>
                <ExternalLinkIcon />
              </a>
            )}
          </div>

          <div>
            <h2 className={styles.sectionTitle}>
              <SparklesIcon className={styles.sectionIcon} />
              Sobre o Evento
            </h2>
            <p className={styles.description}>
              {event.description || 'Participe deste encontro e conecte-se com a comunidade tech de Manaus.'}
            </p>
          </div>

          <div className={styles.venue}>
            <div>
              <h3 className={styles.venueTitle}>Localização do Encontro</h3>
              <p className={styles.venueText}>{event.location}</p>
            </div>
            {safeUrl(event.link) && (
              <a href={safeUrl(event.link)!} target="_blank" rel="noreferrer" className={styles.secondaryBtn}>
                Página Oficial do Evento
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
