'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { 
  UserCircle2, 
  Code2, 
  Plus, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Globe, 
  MapPin, 
  Sparkles,
  Briefcase
} from 'lucide-react';
import { GithubIcon } from '@/components/icons';
import type { Profile, Project } from '@/types/database';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New project form modal/state
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newStack, setNewStack] = useState('');
  const [newGithub, setNewGithub] = useState('');
  const [newDemo, setNewDemo] = useState('');
  const [creatingProj, setCreatingProj] = useState(false);

  useEffect(() => {
    async function loadUserData() {
      try {
        const supabase = createClient();
        const { data: { user: currentUser } } = await supabase.auth.getUser();

        if (!currentUser) {
          router.push('/auth/login');
          return;
        }

        setUser(currentUser);

        // Fetch user profile from public.profiles
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        } else {
          setProfile({
            id: currentUser.id,
            email: currentUser.email,
            full_name: currentUser.user_metadata?.full_name || '',
            username: currentUser.user_metadata?.user_name || currentUser.email?.split('@')[0] || '',
            role: 'Developer',
            location: 'Manaus-AM',
            skills: ['React', 'TypeScript', 'Next.js'],
            available: true,
          });
        }

        // Fetch user projects
        const { data: userProjects } = await supabase
          .from('projects')
          .select('*')
          .eq('author_id', currentUser.id);

        if (userProjects) {
          setProjects(userProjects);
        }
      } catch (err: any) {
        console.error('Erro ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const supabase = createClient();
      const payload = {
        id: user.id,
        username: profile.username || user.email?.split('@')[0],
        full_name: profile.full_name || '',
        email: user.email,
        role: profile.role,
        bio: profile.bio,
        location: profile.location || 'Manaus-AM',
        github: profile.github,
        website: profile.website,
        available: profile.available ?? true,
        skills: typeof profile.skills === 'string' 
          ? (profile.skills as string).split(',').map(s => s.trim()).filter(Boolean)
          : profile.skills || [],
        updated_at: new Date().toISOString(),
      };

      const { error } = await (supabase.from('profiles') as any)
        .upsert(payload, { onConflict: 'id' });

      if (error) throw error;

      setSuccessMsg('Perfil atualizado com sucesso no Supabase!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Falha ao salvar perfil.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setCreatingProj(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const stackArray = newStack.split(',').map(s => s.trim()).filter(Boolean);
      const links = {
        github: newGithub || undefined,
        demo: newDemo || undefined,
      };

      const { data, error } = await (supabase.from('projects') as any)
        .insert({
          title: newTitle,
          description: newDesc,
          stack: stackArray,
          links,
          author_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setProjects([data, ...projects]);
        setIsAddingProject(false);
        setNewTitle('');
        setNewDesc('');
        setNewStack('');
        setNewGithub('');
        setNewDemo('');
        setSuccessMsg('Projeto cadastrado com sucesso!');
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Falha ao cadastrar projeto.');
    } finally {
      setCreatingProj(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#006c49] border-r-transparent" />
        <p className="mt-4 text-xs font-mono text-[#707974]">Carregando dados do perfil...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-[#f7f9fb]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-mono text-[#006c49] uppercase tracking-wider font-semibold">Painel do Membro</span>
          <h1 className="font-display font-bold text-2xl sm:text-4xl text-[#003527]">
            Olá, {profile.full_name || 'Desenvolvedor'} 🌿
          </h1>
          <p className="text-xs text-[#404944] mt-1">
            Gerencie seu perfil visível na comunidade e seus projetos submetidos.
          </p>
        </div>

        <button
          onClick={() => setIsAddingProject(true)}
          className="btn-leaf text-xs"
        >
          <Plus className="w-4 h-4" />
          Publicar Projeto
        </button>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-[#6cf8bb]/20 border border-[#006c49]/30 text-[#00714d] text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#006c49]" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#93000a] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#ba1a1a]" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Settings Form */}
        <div className="lg:col-span-2">
          <div className="manaus-card p-6 sm:p-8">
            <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-[#e0e3e5]">
              <UserCircle2 className="w-5 h-5 text-[#006c49]" />
              <h2 className="font-display font-bold text-lg text-[#003527]">Dados do Perfil</h2>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#003527] mb-1.5">Nome Completo</label>
                  <input
                    type="text"
                    value={profile.full_name || ''}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className="manaus-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#003527] mb-1.5">Username (@)</label>
                  <input
                    type="text"
                    value={profile.username || ''}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    className="manaus-input w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#003527] mb-1.5">Cargo / Especialidade</label>
                  <input
                    type="text"
                    placeholder="Ex: Fullstack Engineer"
                    value={profile.role || ''}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    className="manaus-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#003527] mb-1.5">Localização</label>
                  <input
                    type="text"
                    placeholder="Manaus-AM"
                    value={profile.location || ''}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="manaus-input w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#003527] mb-1.5">Bio / Apresentação</label>
                <textarea
                  rows={3}
                  placeholder="Fale brevemente sobre sua experiência e interesses no ecossistema..."
                  value={profile.bio || ''}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="manaus-input w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#003527] mb-1.5">
                  Habilidades / Tecnologias (separadas por vírgula)
                </label>
                <input
                  type="text"
                  placeholder="React, Next.js, Node.js, Supabase, Tailwind, Python"
                  value={Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills || ''}
                  onChange={(e) => setProfile({ ...profile, skills: e.target.value as any })}
                  className="manaus-input w-full"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#003527] mb-1.5">GitHub URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/usuario"
                    value={profile.github || ''}
                    onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                    className="manaus-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#003527] mb-1.5">Portfólio / Site Pessoal</label>
                  <input
                    type="url"
                    placeholder="https://meusite.dev"
                    value={profile.website || ''}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    className="manaus-input w-full"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={profile.available ?? true}
                  onChange={(e) => setProfile({ ...profile, available: e.target.checked })}
                  className="h-4 w-4 rounded border-[#bfc9c3] text-[#006c49] focus:ring-[#006c49]"
                />
                <label htmlFor="available" className="text-xs text-[#404944] font-medium">
                  Estou disponível para novas oportunidades profissionais ou consultoria
                </label>
              </div>

              <div className="pt-4 border-t border-[#e0e3e5] flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary text-xs !py-2.5 !px-6 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* User Projects Sidebar */}
        <div className="space-y-6">
          <div className="manaus-card p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e0e3e5]">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-[#006c49]" />
                <h3 className="font-display font-bold text-base text-[#003527]">Meus Projetos</h3>
              </div>
              <span className="chip-leaf text-[10px] font-mono">{projects.length} projeto(s)</span>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs text-[#707974] mb-3">Você ainda não cadastrou projetos.</p>
                <button
                  onClick={() => setIsAddingProject(true)}
                  className="text-xs text-[#006c49] font-bold hover:underline"
                >
                  + Publicar primeiro projeto
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-3.5 rounded-xl bg-[#f2f4f6] border border-[#e0e3e5]">
                    <h4 className="font-display font-bold text-sm text-[#003527]">{proj.title}</h4>
                    <p className="text-xs text-[#404944] line-clamp-2 mt-1">{proj.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {proj.stack?.map((s, i) => (
                        <span key={i} className="chip-river text-[10px] font-mono !py-0.5 !px-1.5">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Project Modal */}
      {isAddingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="manaus-card w-full max-w-lg p-6 sm:p-8 relative shadow-elevated">
            <h3 className="font-display font-bold text-xl text-[#003527] mb-4">Publicar Novo Projeto</h3>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#003527] mb-1.5">Título do Projeto</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: RioTech Maps"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="manaus-input w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#003527] mb-1.5">Descrição</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Descreva o propósito do projeto e impacto regional..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="manaus-input w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#003527] mb-1.5">Stack (separadas por vírgula)</label>
                <input
                  type="text"
                  placeholder="Next.js, Supabase, Tailwind, TypeScript"
                  value={newStack}
                  onChange={(e) => setNewStack(e.target.value)}
                  className="manaus-input w-full"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#003527] mb-1.5">Link GitHub</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={newGithub}
                    onChange={(e) => setNewGithub(e.target.value)}
                    className="manaus-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#003527] mb-1.5">Demo / Site</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newDemo}
                    onChange={(e) => setNewDemo(e.target.value)}
                    className="manaus-input w-full"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e0e3e5]">
                <button
                  type="button"
                  onClick={() => setIsAddingProject(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#707974] hover:text-[#191c1e]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creatingProj}
                  className="btn-leaf text-xs !py-2 !px-5 disabled:opacity-50"
                >
                  {creatingProj ? 'Salvando...' : 'Publicar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
