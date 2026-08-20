'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Globe, Users, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from '@/components/icons';
import { MOCK_DEVS } from '@/lib/data/mock-data';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types/database';

export default function DevsPage() {
  const [devs, setDevs] = useState<Profile[]>(MOCK_DEVS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#006c49]/10 text-[#006c49] border border-[#006c49]/20 text-xs font-semibold mb-3">
          <Users className="w-3.5 h-3.5" />
          <span>Diretório da Comunidade</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-5xl text-[#003527] tracking-tight">
          Desenvolvedores em <span className="text-[#006c49]">Manaus</span>
        </h1>
        <p className="text-[#404944] text-sm sm:text-base mt-2 max-w-2xl">
          Conecte-se com engenheiros de software, designers, especialistas em dados e arquitetos de soluções do Amazonas.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="manaus-card p-5 sm:p-6 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-[#707974] pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Buscar por nome, especialidade ou tecnologia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="manaus-input w-full !pl-10"
            />
          </div>

          <button
            onClick={() => setOnlyAvailable(!onlyAvailable)}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
              onlyAvailable
                ? 'bg-[#006c49]/10 text-[#006c49] border-[#006c49]'
                : 'bg-white text-[#404944] border-[#e0e3e5] hover:bg-[#f2f4f6]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${onlyAvailable ? 'bg-[#006c49]' : 'bg-[#707974]'}`} />
            Disponível para projetos
          </button>
        </div>

        {/* Skill tags selector */}
        {allSkills.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
            <span className="text-xs text-[#707974] font-medium flex-shrink-0">Filtro:</span>
            <button
              onClick={() => setSelectedSkill(null)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex-shrink-0 ${
                selectedSkill === null
                  ? 'bg-[#003527] text-white font-semibold'
                  : 'bg-[#f2f4f6] text-[#404944] hover:bg-[#e6e8ea]'
              }`}
            >
              Todas
            </button>
            {allSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => setSelectedSkill(skill === selectedSkill ? null : skill)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex-shrink-0 ${
                  selectedSkill === skill
                    ? 'bg-[#003527] text-white font-semibold'
                    : 'bg-[#f2f4f6] text-[#404944] hover:bg-[#e6e8ea]'
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
            <div key={i} className="manaus-card p-6 h-56 animate-pulse bg-[#f2f4f6]" />
          ))}
        </div>
      ) : filteredDevs.length === 0 ? (
        <div className="text-center py-16 manaus-card">
          <p className="text-[#707974] text-sm">Nenhum desenvolvedor encontrado com esses critérios.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevs.map((dev) => (
            <div key={dev.id} className="manaus-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-[#003527] text-white flex items-center justify-center font-display font-bold text-base shadow-sm">
                      {dev.full_name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-base text-[#003527] leading-tight">{dev.full_name}</h2>
                      <p className="text-xs text-[#006c49] font-medium">@{dev.username}</p>
                    </div>
                  </div>
                  {dev.available ? (
                    <span className="chip-leaf text-[10px] font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]" />
                      Disponível
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f2f4f6] text-[#707974]">
                      Ocupado
                    </span>
                  )}
                </div>

                <p className="text-xs font-semibold text-[#00314a] mb-1">{dev.role || 'Software Engineer'}</p>
                <p className="text-xs text-[#404944] line-clamp-3 mb-5 leading-relaxed">
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

              <div className="pt-4 border-t border-[#e0e3e5] flex items-center justify-between text-xs text-[#707974]">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-[#006c49]" />
                  {dev.location || 'Manaus-AM'}
                </span>
                <div className="flex items-center gap-3">
                  {dev.github && (
                    <a href={dev.github} target="_blank" rel="noreferrer" className="text-[#404944] hover:text-[#003527] transition-colors">
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  )}
                  {dev.website && (
                    <a href={dev.website} target="_blank" rel="noreferrer" className="text-[#404944] hover:text-[#00314a] transition-colors">
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
