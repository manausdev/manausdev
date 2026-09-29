'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AVAILABILITY_FILTERS } from '@/lib/devs-meta';
import { User } from '@supabase/supabase-js';
import { 
  UserCircle2Icon, 
  Code2Icon, 
  PlusIcon, 
  SaveIcon, 
  CheckCircle2Icon, 
  AlertCircleIcon, 
  Trash2Icon,
  Edit3Icon,
  ExternalLinkIcon
} from '@/components/icons';
import type { Profile, Project, Database, ProjectLinks } from '@/types/database';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Project form modal/state (Create & Edit)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formStack, setFormStack] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formGithub, setFormGithub] = useState('');
  const [formDemo, setFormDemo] = useState('');
  const [submittingProj, setSubmittingProj] = useState(false);

  useEffect(() => {
    async function loadUserData() {
      try {
        const supabase = createClient();
        const { data: { user: currentUser } } = await supabase.auth.getUser();

        if (!currentUser) {
          router.push('/auth/login?redirectedFrom=/dashboard');
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
            full_name: currentUser.user_metadata?.full_name || '',
            username: currentUser.user_metadata?.user_name || currentUser.email?.split('@')[0] || '',
            role: 'Developer',
            location: 'Manaus-AM',
            city: 'Manaus',
            seniority: null,
            skills: ['React', 'TypeScript', 'Next.js'],
            availability: 'open',
          });
        }

        // Fetch user projects
        const { data: userProjects } = await supabase
          .from('projects')
          .select('*')
          .eq('author_id', currentUser.id)
          .order('created_at', { ascending: false });

        if (userProjects) {
          setProjects(userProjects);
        }
      } catch (err: unknown) {
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
      const skillsArray = typeof profile.skills === 'string'
        ? (profile.skills as string).split(',').map(s => s.trim()).filter(Boolean)
        : profile.skills || [];

      const profilePayload: Database['public']['Tables']['profiles']['Insert'] = {
        id: user.id,
        username: profile.username || user.email?.split('@')[0] || 'user',
        full_name: profile.full_name || '',
        role: profile.role || 'Developer',
        bio: profile.bio || null,
        location: profile.location || 'Manaus-AM',
        city: profile.city || 'Manaus',
        seniority: profile.seniority || null,
        github: profile.github || null,
        website: profile.website || null,
        linkedin: profile.linkedin || null,
        availability: profile.availability || 'open',
        skills: skillsArray,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        // @ts-expect-error Supabase postgrest query builder overload
        .upsert(profilePayload);

      if (error) throw error;

      setSuccessMsg('Perfil atualizado com sucesso no Supabase!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha ao salvar perfil.';
      setErrorMsg(message);
    } finally {
      setSaving(false);
    }
  };

  const openAddProjectModal = () => {
    setEditingProjectId(null);
    setFormTitle('');
    setFormDesc('');
    setFormStack('');
    setFormImageUrl('');
    setFormGithub('');
    setFormDemo('');
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (proj: Project) => {
    setEditingProjectId(proj.id);
    setFormTitle(proj.title);
    setFormDesc(proj.description);
    setFormStack(proj.stack ? proj.stack.join(', ') : '');
    setFormImageUrl(proj.image_url || '');
    setFormGithub(proj.links?.github || '');
    setFormDemo(proj.links?.demo || proj.links?.website || '');
    setIsProjectModalOpen(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return;
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      setProjects(projects.filter(p => p.id !== projectId));
      setSuccessMsg('Projeto excluído com sucesso!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha ao excluir projeto.';
      setErrorMsg(message);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmittingProj(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const stackArray = formStack.split(',').map(s => s.trim()).filter(Boolean);
      const links: ProjectLinks = {
        github: formGithub || undefined,
        demo: formDemo || undefined,
      };

      if (editingProjectId) {
        // Update existing
        const updatePayload: Database['public']['Tables']['projects']['Update'] = {
          title: formTitle,
          description: formDesc,
          stack: stackArray,
          image_url: formImageUrl || null,
          links,
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from('projects')
          // @ts-expect-error Supabase postgrest query builder overload
          .update(updatePayload)
          .eq('id', editingProjectId)
          .select()
          .single();

        if (error) throw error;

        if (data) {
          setProjects(projects.map(p => p.id === editingProjectId ? data : p));
          setIsProjectModalOpen(false);
          setSuccessMsg('Projeto atualizado com sucesso!');
          setTimeout(() => setSuccessMsg(null), 4000);
        }
      } else {
        // Insert new
        const insertPayload: Database['public']['Tables']['projects']['Insert'] = {
          title: formTitle,
          description: formDesc,
          stack: stackArray,
          image_url: formImageUrl || null,
          links,
          author_id: user.id,
        };

        const { data, error } = await supabase
          .from('projects')
          // @ts-expect-error Supabase postgrest query builder overload
          .insert(insertPayload)
          .select()
          .single();

        if (error) throw error;

        if (data) {
          setProjects([data, ...projects]);
          setIsProjectModalOpen(false);
          setSuccessMsg('Projeto publicado com sucesso!');
          setTimeout(() => setSuccessMsg(null), 4000);
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha ao salvar projeto.';
      setErrorMsg(message);
    } finally {
      setSubmittingProj(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent" />
        <p className="mt-4 text-xs font-mono text-faint">Carregando dados do perfil...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-canvas">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-mono text-accent-text uppercase tracking-wider font-semibold">Painel do Membro</span>
          <h1 className="font-display font-bold text-2xl sm:text-4xl text-ink">
            Olá, {profile.full_name || 'Desenvolvedor'} 🌿
          </h1>
          <p className="text-xs text-muted mt-1">
            Gerencie seu perfil visível na comunidade e seus projetos submetidos.
          </p>
        </div>

        <button
          onClick={openAddProjectModal}
          className="btn-leaf text-xs"
        >
          <PlusIcon className="w-4 h-4" />
          Publicar Projeto
        </button>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-success-soft border border-success/30 text-success-text text-xs flex items-center gap-2 font-medium">
          <CheckCircle2Icon className="w-4 h-4 flex-shrink-0 text-accent-text" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-danger-soft border border-danger/30 text-danger-text text-xs flex items-center gap-2">
          <AlertCircleIcon className="w-4 h-4 flex-shrink-0 text-danger" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Settings Form */}
        <div className="lg:col-span-2">
          <div className="manaus-card p-6 sm:p-8">
            <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-border">
              <UserCircle2Icon className="w-5 h-5 text-accent-text" />
              <h2 className="font-display font-bold text-lg text-ink">Dados do Perfil</h2>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">Nome Completo</label>
                  <input
                    type="text"
                    value={profile.full_name || ''}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className="manaus-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">Username (@)</label>
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
                  <label className="block text-xs font-semibold text-ink mb-1.5">Cargo / Especialidade</label>
                  <input
                    type="text"
                    placeholder="Ex: Fullstack Engineer"
                    value={profile.role || ''}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    className="manaus-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">Senioridade</label>
                  <select
                    value={profile.seniority || ''}
                    onChange={(e) => setProfile({ ...profile, seniority: e.target.value || null })}
                    className="manaus-input w-full"
                  >
                    <option value="">Selecione...</option>
                    <option value="junior">Júnior</option>
                    <option value="pleno">Pleno</option>
                    <option value="senior">Sênior</option>
                    <option value="lead">Lead</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">Cidade (usada nos filtros do diretório)</label>
                  <input
                    type="text"
                    placeholder="Manaus"
                    value={profile.city || ''}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    className="manaus-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">Localização (texto livre de exibição)</label>
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
                <label className="block text-xs font-semibold text-ink mb-1.5">Bio / Apresentação</label>
                <textarea
                  rows={3}
                  placeholder="Fale brevemente sobre sua experiência e interesses no ecossistema..."
                  value={profile.bio || ''}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="manaus-input w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  Habilidades / Tecnologias (separadas por vírgula)
                </label>
                <input
                  type="text"
                  placeholder="React, Next.js, Node.js, Supabase, Tailwind, Python"
                  value={Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills || ''}
                  onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(',').map(s => s.trim()) })}
                  className="manaus-input w-full"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">GitHub URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/usuario"
                    value={profile.github || ''}
                    onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                    className="manaus-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">Portfólio / Site Pessoal</label>
                  <input
                    type="url"
                    placeholder="https://meusite.dev"
                    value={profile.website || ''}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    className="manaus-input w-full"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label htmlFor="availability" className="text-xs text-muted font-medium block mb-1.5">
                  Disponibilidade para novos projetos
                </label>
                <select
                  id="availability"
                  value={profile.availability || 'open'}
                  onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
                  className="manaus-input w-full"
                >
                  {AVAILABILITY_FILTERS.map((option) => (
                    <option key={option.param} value={option.db}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-border flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary text-xs !py-2.5 !px-6 disabled:opacity-50"
                >
                  <SaveIcon className="w-4 h-4" />
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* User Projects Sidebar */}
        <div className="space-y-6">
          <div className="manaus-card p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Code2Icon className="w-5 h-5 text-accent-text" />
                <h3 className="font-display font-bold text-base text-ink">Meus Projetos</h3>
              </div>
              <span className="chip-leaf text-[10px] font-mono">{projects.length} projeto(s)</span>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs text-faint mb-3">Você ainda não cadastrou projetos.</p>
                <button
                  onClick={openAddProjectModal}
                  className="text-xs text-accent-text font-bold hover:underline"
                >
                  + Publicar primeiro projeto
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-4 rounded-xl bg-surface-1 border border-border flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-display font-bold text-sm text-ink">{proj.title}</h4>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEditProjectModal(proj)}
                            className="p-1 text-muted hover:text-accent-text rounded hover:bg-surface-1 transition-colors"
                            title="Editar Projeto"
                          >
                            <Edit3Icon className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-1 text-faint hover:text-danger rounded hover:bg-danger-soft transition-colors"
                            title="Excluir Projeto"
                          >
                            <Trash2Icon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-muted line-clamp-2 mt-1">{proj.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex flex-wrap gap-1">
                        {proj.stack?.slice(0, 2).map((s, i) => (
                          <span key={i} className="chip-river text-[10px] font-mono !py-0.5 !px-1.5">
                            {s}
                          </span>
                        ))}
                      </div>
                      {proj.links?.demo || proj.links?.github ? (
                        <a
                          href={proj.links.demo || proj.links.github}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-semibold text-accent-text hover:underline flex items-center gap-1"
                        >
                          <span>Ver</span>
                          <ExternalLinkIcon className="w-3 h-3" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Modal (Add or Edit) */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="manaus-card w-full max-w-lg p-6 sm:p-8 relative shadow-elevated">
            <h3 className="font-display font-bold text-xl text-ink mb-4">
              {editingProjectId ? 'Editar Projeto' : 'Publicar Novo Projeto'}
            </h3>
            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">Título do Projeto</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: RioTech Maps"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="manaus-input w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">Descrição</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Descreva o propósito do projeto e impacto regional..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="manaus-input w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">Stack (separadas por vírgula)</label>
                <input
                  type="text"
                  placeholder="Next.js, Supabase, Tailwind, TypeScript"
                  value={formStack}
                  onChange={(e) => setFormStack(e.target.value)}
                  className="manaus-input w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">URL da Imagem / Screenshot (Preview)</label>
                <input
                  type="url"
                  placeholder="https://exemplo.com/preview.png"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="manaus-input w-full"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">Link GitHub</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={formGithub}
                    onChange={(e) => setFormGithub(e.target.value)}
                    className="manaus-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">Demo / Site</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formDemo}
                    onChange={(e) => setFormDemo(e.target.value)}
                    className="manaus-input w-full"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-faint hover:text-ink"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submittingProj}
                  className="btn-leaf text-xs !py-2 !px-5 disabled:opacity-50"
                >
                  {submittingProj ? 'Salvando...' : editingProjectId ? 'Salvar Alterações' : 'Publicar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

