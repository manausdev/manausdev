'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Globe, CheckCircle2, XCircle, Users } from 'lucide-react';
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
        // use fallback mock
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00F5FF]/10 text-[#00F5FF] border border-[#00F5FF]/25 text-xs font-mono mb-3">
          <Users className="w-3.5 h-3.5" />
          <span>Diretório da Comunidade</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
          Desenvolvedores em <span className="gradient-text-cyber">Manaus</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
          Conecte-se com engenheiros de software, designers, dados e especialistas em tecnologia do ecossistema amazonense.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="glass-card p-4 sm:p-6 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome, cargo ou bio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#070A12]/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00F5FF] focus:ring-1 focus:ring-[#00F5FF]"
            />
          </div>

          <button
            onClick={() => setOnlyAvailable(!onlyAvailable)}
            className={`px-4 py-2.5 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 transition-all ${
              onlyAvailable
                ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/50 shadow-sm'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${onlyAvailable ? 'bg-[#10B981]' : 'bg-slate-500'}`} />
            Disponível para projetos
          </button>
        </div>

        {/* Skill tags selector */}
        {allSkills.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
            <span className="text-xs text-slate-400 font-mono flex-shrink-0">Stack:</span>
            <button
              onClick={() => setSelectedSkill(null)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors flex-shrink-0 ${
                selectedSkill === null
                  ? 'bg-[#00F5FF] text-[#00282B] font-semibold'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              Todas
            </button>
            {allSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => setSelectedSkill(skill === selectedSkill ? null : skill)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors flex-shrink-0 ${
                  selectedSkill === skill
                    ? 'bg-[#00F5FF] text-[#00282B] font-semibold'
                    : 'bg-white/5 text-slate-300 hover:text-white border border-white/10'
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
            <div key={i} className="glass-card p-6 h-56 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : filteredDevs.length === 0 ? (
        <div className="text-center py-16 glass-card">
          <p className="text-slate-400 text-sm">Nenhum desenvolvedor encontrado com esses critérios.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevs.map((dev) => (
            <div key={dev.id} className="glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00F5FF]/20 to-[#10B981]/20 border border-[#00F5FF]/30 flex items-center justify-center text-white font-bold font-mono text-base">
                      {dev.full_name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-base text-white">{dev.full_name}</h2>
                      <p className="text-xs text-[#00F5FF] font-medium">@{dev.username}</p>
                    </div>
                  </div>
                  {dev.available ? (
                    <span className="px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[10px] font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                      Disponível
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/5 text-[10px] font-mono">
                      Ocupado
                    </span>
                  )}
                </div>

                <p className="text-xs font-semibold text-slate-200 mb-1">{dev.role || 'Software Engineer'}</p>
                <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                  {dev.bio || 'Membro do ecossistema ManausDev.'}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {(dev.skills || []).map((skill, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/5 text-slate-300 border border-white/10">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  {dev.location || 'Manaus-AM'}
                </span>
                <div className="flex items-center gap-2.5">
                  {dev.github && (
                    <a href={dev.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  )}
                  {dev.website && (
                    <a href={dev.website} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#00F5FF] transition-colors">
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
