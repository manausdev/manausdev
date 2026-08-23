import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Clock, 
  Share2, 
  Sparkles 
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { MOCK_EVENTS } from '@/lib/data/mock-data';
import { formatDate } from '@/lib/utils';
import type { EventItem } from '@/types/database';

export async function generateStaticParams() {
  return MOCK_EVENTS.map((ev) => ({
    id: ev.id,
  }));
}

interface EventDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  let event: EventItem | undefined = MOCK_EVENTS.find((e) => e.id === id);

  try {
    const supabase = await createClient();
    const { data: eventData } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (eventData) {
      event = eventData;
    }
  } catch {
    // Fallback to mock
  }

  if (!event) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/eventos"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#006c49] hover:text-[#003527] transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para a agenda de eventos
      </Link>

      <div className="manaus-card overflow-hidden border border-[#e0e3e5] mb-8">
        <div className="relative h-60 sm:h-72 w-full bg-[#00281e] overflow-hidden border-b border-[#e0e3e5]">
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover opacity-90"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#003527] to-[#002219] p-4 text-center">
              <Calendar className="w-16 h-16 text-[#6cf8bb]/60 mb-2" />
            </div>
          )}
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-[#003527]/90 backdrop-blur-md text-[#6cf8bb] text-xs font-mono px-3 py-1.5 rounded-full border border-[#6cf8bb]/30 font-bold uppercase tracking-wider shadow-md">
              {event.type}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-[#e0e3e5]">
            <div>
              <span className="text-xs font-mono text-[#006c49] font-semibold uppercase tracking-wider">
                📅 {formatDate(event.date)}
              </span>
              <h1 className="font-display font-bold text-2xl sm:text-4xl text-[#003527] mt-1.5">
                {event.title}
              </h1>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#404944] mt-2">
                <MapPin className="w-4 h-4 text-[#006c49] flex-shrink-0" />
                <span>{event.location}</span>
              </div>
            </div>

            {event.link && (
              <div className="flex-shrink-0">
                <a
                  href={event.link}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-leaf !py-3 !px-6 text-xs flex items-center gap-2 shadow-md w-full sm:w-auto justify-center"
                >
                  <span>Garantir Inscrição</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#707974] font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#006c49]" />
              Sobre o Evento
            </h2>
            <p className="text-sm sm:text-base text-[#191c1e] leading-relaxed whitespace-pre-line max-w-3xl">
              {event.description || 'Participe deste encontro e conecte-se com a comunidade tech de Manaus.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#f2f4f6] border border-[#e0e3e5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-sm text-[#003527]">Localização do Encontro</h3>
              <p className="text-xs text-[#707974] mt-0.5">{event.location}</p>
            </div>
            {event.link && (
              <a
                href={event.link}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary !py-2 !px-4 text-xs"
              >
                Página Oficial do Evento
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

