'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin, Globe, Users, ArrowRight } from 'lucide-react';
import { GithubIcon } from '@/components/icons';
import { MOCK_DEVS } from '@/lib/data/mock-data';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types/database';

function DevsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSkill = searchParams.get('skill');
  const initialSearch = searchParams.get('q') || '';
  const initialAvailable = searchParams.get('available') === 'true';

  const [devs, setDevs] = useState<Profile[]>(MOCK_DEVS);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(initialSkill);
  const [onlyAvailable, setOnlyAvailable] = useState(initialAvailable);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDevs() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('profiles').select('*');
        if (data && data.length > 0 && !error) {
          setDevs(data);
        }
      } catch {
        // mock fallback
      } finally {
        setLoading(false);
      }
    }
    loadDevs();
  }, []);

  // Sync state to URL params without full page reload
  const updateFilters = (newSearch: string, newSkill: string | null, newAvailable: boolean) => {
    const params = new URLSearchParams();
    if (newSearch) params.set('q', newSearch);
    if (newSkill) params.set('skill', newSkill);
    if (newAvailable) params.set('available', 'true');

    const queryString = params.toString();
    router.replace(`/devs${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    updateFilters(val, selectedSkill, onlyAvailable);
  };

  const handleSkillChange = (skill: string | null) => {
    const nextSkill = skill === selectedSkill ? null : skill;
    setSelectedSkill(nextSkill);
    updateFilters(searchTerm, nextSkill, onlyAvailable);
  };

  const handleAvailableToggle = () => {
    const nextAvail = !onlyAvailable;
    setOnlyAvailable(nextAvail);
    updateFilters(searchTerm, selectedSkill, nextAvail);
  };

  const allSkills = useMemo(() => {
    const skills = new Set<string>();
    devs.forEach((d) => d.skills?.forEach((s) => skills.add(s)));
    return Array.from(skills);
  }, [devs]);

  const filteredDevs = useMemo(() => {
    return devs.filter((dev) => {
      const matchSearch =
        dev.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dev.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dev.role && dev.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (dev.bio && dev.bio.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchSkill = selectedSkill ? dev.skills?.includes(selectedSkill) : true;
      const matchAvailable = onlyAvailable ? dev.available : true;

      return matchSearch && matchSkill && matchAvailable;
    });
  }, [devs, searchTerm, selectedSkill, onlyAvailable]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent-text border border-accent/20 text-xs font-semibold mb-3">
          <Users className="w-3.5 h-3.5" />
          <span>Diretório da Comunidade</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-5xl text-ink tracking-tight">
          Desenvolvedores em <span className="text-accent-text">Manaus</span>
        </h1>
        <p className="text-muted text-sm sm:text-base mt-2 max-w-2xl">
          Conecte-se com engenheiros de software, designers, especialistas em dados e arquitetos de soluções do Amazonas.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="manaus-card p-5 sm:p-6 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-faint pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Buscar por nome, especialidade ou tecnologia..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="manaus-input w-full !pl-10"
            />
          </div>

          <button
            onClick={handleAvailableToggle}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
              onlyAvailable
                ? 'bg-accent/10 text-accent-text border-accent'
                : 'bg-surface text-muted border-border hover:bg-surface-1'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${onlyAvailable ? 'bg-accent' : 'bg-faint'}`} />
            Disponível para projetos
          </button>
        </div>

        {/* Skill tags selector */}
        {allSkills.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
            <span className="text-xs text-faint font-medium flex-shrink-0">Filtro:</span>
            <button
              onClick={() => handleSkillChange(null)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex-shrink-0 ${
                selectedSkill === null
                  ? 'bg-deep text-white font-semibold'
                  : 'bg-surface-1 text-muted hover:bg-surface-2'
              }`}
            >
              Todas
            </button>
            {allSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => handleSkillChange(skill)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex-shrink-0 ${
                  selectedSkill === skill
                    ? 'bg-deep text-white font-semibold'
                    : 'bg-surface-1 text-muted hover:bg-surface-2'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Devs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="manaus-card p-6 h-56 animate-pulse bg-surface-1" />
          ))}
        </div>
      ) : filteredDevs.length === 0 ? (
        <div className="text-center py-16 manaus-card">
          <p className="text-faint text-sm">Nenhum desenvolvedor encontrado com esses critérios.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevs.map((dev) => (
            <div key={dev.id} className="manaus-card p-6 flex flex-col justify-between group hover:border-accent/50 transition-all">
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <Link href={`/devs/${dev.username}`} className="flex items-center gap-3.5 group-hover:opacity-90">
                    <div className="w-12 h-12 rounded-full bg-deep text-white flex items-center justify-center font-display font-bold text-base shadow-sm flex-shrink-0">
                      {dev.full_name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-base text-ink leading-tight group-hover:text-accent-text transition-colors">
                        {dev.full_name}
                      </h2>
                      <p className="text-xs text-accent-text font-medium">@{dev.username}</p>
                    </div>
                  </Link>
                  {dev.available ? (
                    <span className="chip-leaf text-[10px] font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      Disponível
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-1 text-faint">
                      Ocupado
                    </span>
                  )}
                </div>

                <p className="text-xs font-semibold text-accent-text mb-1">{dev.role || 'Software Engineer'}</p>
                <p className="text-xs text-muted line-clamp-3 mb-5 leading-relaxed">
                  {dev.bio || 'Profissional de tecnologia membro da comunidade ManausDev.'}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {(dev.skills || []).map((skill, i) => (
                    <span key={i} className="chip-leaf text-[11px] !py-0.5 !px-2">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-faint">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-accent-text" />
                  {dev.location || 'Manaus-AM'}
                </span>
                <div className="flex items-center gap-2.5">
                  <Link
                    href={`/devs/${dev.username}`}
                    className="text-xs font-semibold text-accent-text hover:underline flex items-center gap-1"
                  >
                    <span>Perfil</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DevsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-10 bg-surface-2 w-64 rounded-lg animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="manaus-card p-6 h-56 animate-pulse bg-surface-1" />
          ))}
        </div>
      </div>
    }>
      <DevsContent />
    </Suspense>
  );
}
