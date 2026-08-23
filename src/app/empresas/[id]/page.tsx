import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Globe, 
  Users, 
  Briefcase, 
  ExternalLink 
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { MOCK_COMPANIES, MOCK_JOBS } from '@/lib/data/mock-data';
import type { Company, Job } from '@/types/database';

export async function generateStaticParams() {
  return MOCK_COMPANIES.map((comp) => ({
    id: comp.id,
  }));
}

interface CompanyDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const { id } = await params;
  let company: Company | undefined = MOCK_COMPANIES.find((c) => c.id === id);
  let companyJobs: Job[] = [];

  try {
    const supabase = await createClient();
    const { data: compData } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();

    if (compData) {
      company = compData;
    }

    if (company) {
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('*')
        .eq('company_id', company.id);

      if (jobsData && jobsData.length > 0) {
        companyJobs = jobsData;
      } else {
        // Fallback filter mock jobs by name
        companyJobs = MOCK_JOBS.filter(j => j.company_name?.toLowerCase() === company?.name.toLowerCase());
      }
    }
  } catch {
    // Fallback to mock
  }

  if (!company) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/empresas"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#006c49] hover:text-[#003527] transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para o diretório de empresas
      </Link>

      <div className="manaus-card overflow-hidden border border-[#e0e3e5] mb-8">
        <div className="relative h-48 sm:h-64 w-full bg-[#00281e] overflow-hidden border-b border-[#e0e3e5]">
          {company.image_url ? (
            <img
              src={company.image_url}
              alt={company.name}
              className="w-full h-full object-cover opacity-85"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#00314a] to-[#002219] p-4 text-center">
              <Building2 className="w-16 h-16 text-[#6cf8bb]/60 mb-2" />
            </div>
          )}
          {company.size && (
            <div className="absolute top-4 right-4 z-10">
              <span className="bg-[#003527]/90 backdrop-blur-md text-[#6cf8bb] text-xs font-mono px-3 py-1.5 rounded-full border border-[#6cf8bb]/30 font-semibold shadow-md flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#6cf8bb]" />
                {company.size} colaboradores
              </span>
            </div>
          )}
        </div>

        <div className="p-6 sm:p-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#e0e3e5]">
            <div className="flex items-center gap-4">
              {company.logo_url ? (
                <img
                  src={company.logo_url}
                  alt={`Logo ${company.name}`}
                  className="w-16 h-16 rounded-xl object-cover border border-[#e0e3e5] shadow-sm bg-white"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-[#003527] text-white flex items-center justify-center font-display font-bold text-2xl shadow-sm">
                  {company.name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#003527]">
                  {company.name}
                </h1>
                <p className="text-xs sm:text-sm text-[#006c49] font-semibold mt-0.5">
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
                <Globe className="w-4 h-4" />
              </a>
            )}
          </div>

          <div>
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#707974] font-semibold mb-3">
              Sobre a Empresa / Instituto
            </h2>
            <p className="text-sm sm:text-base text-[#191c1e] leading-relaxed max-w-4xl">
              {company.description || 'Empresa participante do ecossistema de tecnologia de Manaus.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-6 pt-4 border-t border-[#e0e3e5] text-xs text-[#707974]">
            <span className="flex items-center gap-1.5 font-mono">
              <MapPin className="w-4 h-4 text-[#006c49]" />
              {company.location || 'Manaus-AM'}
            </span>
            <span className="flex items-center gap-1.5 font-mono">
              <Building2 className="w-4 h-4 text-[#00314a]" />
              {company.industry || 'Tecnologia'}
            </span>
          </div>
        </div>
      </div>

      {/* Vagas da Empresa */}
      {companyJobs.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="w-5 h-5 text-[#006c49]" />
            <h2 className="font-display font-bold text-xl text-[#003527]">Vagas Abertas nesta Empresa</h2>
          </div>

          <div className="space-y-4">
            {companyJobs.map((job) => (
              <div key={job.id} className="manaus-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#e0e3e5]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="chip-leaf text-xs font-mono">{job.type}</span>
                    {job.remote && <span className="chip-river text-xs font-mono">Remoto</span>}
                  </div>
                  <h3 className="font-display font-bold text-base text-[#003527]">{job.title}</h3>
                  <p className="text-xs text-[#707974] mt-1 font-mono">{job.salary || 'A combinar'}</p>
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

