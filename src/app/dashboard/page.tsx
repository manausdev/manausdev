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
import styles from './dashboard.module.css';
import { cn } from '@/lib/utils';

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
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Carregando dados do perfil...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <span className={styles.kicker}>Painel do Membro</span>
          <h1 className={styles.title}>
            Olá, {profile.full_name || 'Desenvolvedor'} 🌿
          </h1>
          <p className={styles.subtitle}>
            Gerencie seu perfil visível na comunidade e seus projetos submetidos.
          </p>
        </div>

        <button
          onClick={openAddProjectModal}
          className={cn('btn-leaf', styles.publishBtn)}
        >
          <PlusIcon className="w-4 h-4" />
          Publicar Projeto
        </button>
      </div>

      {successMsg && (
        <div className={styles.successBanner}>
          <CheckCircle2Icon className={cn('w-4 h-4', styles.bannerIconSuccess)} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className={styles.errorBanner}>
          <AlertCircleIcon className={cn('w-4 h-4', styles.bannerIconError)} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className={styles.layout}>
        {/* Profile Settings Form */}
        <div>
          <div className={cn('manaus-card', styles.card)}>
            <div className={styles.cardHeader}>
              <UserCircle2Icon className={cn('w-5 h-5', styles.cardHeaderIcon)} />
              <h2 className={styles.cardTitle}>Dados do Perfil</h2>
            </div>

            <form onSubmit={handleSaveProfile} className={styles.form}>
              <div className={styles.row2}>
                <div>
                  <label className={styles.label}>Nome Completo</label>
                  <input
                    type="text"
                    value={profile.full_name || ''}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className={cn('manaus-input', styles.input)}
                  />
                </div>
                <div>
                  <label className={styles.label}>Username (@)</label>
                  <input
                    type="text"
                    value={profile.username || ''}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    className={cn('manaus-input', styles.input)}
                  />
                </div>
              </div>

              <div className={styles.row2}>
                <div>
                  <label className={styles.label}>Cargo / Especialidade</label>
                  <input
                    type="text"
                    placeholder="Ex: Fullstack Engineer"
                    value={profile.role || ''}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    className={cn('manaus-input', styles.input)}
                  />
                </div>
                <div>
                  <label className={styles.label}>Senioridade</label>
                  <select
                    value={profile.seniority || ''}
                    onChange={(e) => setProfile({ ...profile, seniority: e.target.value || null })}
                    className={cn('manaus-input', styles.input)}
                  >
                    <option value="">Selecione...</option>
                    <option value="junior">Júnior</option>
                    <option value="pleno">Pleno</option>
                    <option value="senior">Sênior</option>
                    <option value="lead">Lead</option>
                  </select>
                </div>
              </div>

              <div className={styles.row2}>
                <div>
                  <label className={styles.label}>Cidade (usada nos filtros do diretório)</label>
                  <input
                    type="text"
                    placeholder="Manaus"
                    value={profile.city || ''}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    className={cn('manaus-input', styles.input)}
                  />
                </div>
                <div>
                  <label className={styles.label}>Localização (texto livre de exibição)</label>
                  <input
                    type="text"
                    placeholder="Manaus-AM"
                    value={profile.location || ''}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className={cn('manaus-input', styles.input)}
                  />
                </div>
              </div>

              <div>
                <label className={styles.label}>Bio / Apresentação</label>
                <textarea
                  rows={3}
                  placeholder="Fale brevemente sobre sua experiência e interesses no ecossistema..."
                  value={profile.bio || ''}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className={cn('manaus-input', styles.input)}
                />
              </div>

              <div>
                <label className={styles.label}>
                  Habilidades / Tecnologias (separadas por vírgula)
                </label>
                <input
                  type="text"
                  placeholder="React, Next.js, Node.js, Supabase, Tailwind, Python"
                  value={Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills || ''}
                  onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(',').map(s => s.trim()) })}
                  className={cn('manaus-input', styles.input)}
                />
              </div>

              <div className={styles.row2}>
                <div>
                  <label className={styles.label}>GitHub URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/usuario"
                    value={profile.github || ''}
                    onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                    className={cn('manaus-input', styles.input)}
                  />
                </div>
                <div>
                  <label className={styles.label}>Portfólio / Site Pessoal</label>
                  <input
                    type="url"
                    placeholder="https://meusite.dev"
                    value={profile.website || ''}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    className={cn('manaus-input', styles.input)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="availability" className={styles.labelMuted}>
                  Disponibilidade para novos projetos
                </label>
                <select
                  id="availability"
                  value={profile.availability || 'open'}
                  onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
                  className={cn('manaus-input', styles.input)}
                >
                  {AVAILABILITY_FILTERS.map((option) => (
                    <option key={option.param} value={option.db}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.actionsRow}>
                <button
                  type="submit"
                  disabled={saving}
                  className={cn('btn-primary', styles.saveBtn)}
                >
                  <SaveIcon className="w-4 h-4" />
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* User Projects Sidebar */}
        <div>
          <div className={cn('manaus-card', styles.sideCard)}>
            <div className={styles.sideHeader}>
              <div className={styles.sideTitleRow}>
                <Code2Icon className={cn('w-5 h-5', styles.sideTitleIcon)} />
                <h3 className={styles.sideTitle}>Meus Projetos</h3>
              </div>
              <span className={cn('chip-leaf', styles.countChip)}>{projects.length} projeto(s)</span>
            </div>

            {projects.length === 0 ? (
              <div className={styles.emptyProjects}>
                <p className={styles.emptyText}>Você ainda não cadastrou projetos.</p>
                <button
                  onClick={openAddProjectModal}
                  className={styles.emptyLink}
                >
                  + Publicar primeiro projeto
                </button>
              </div>
            ) : (
              <div className={styles.projList}>
                {projects.map((proj) => (
                  <div key={proj.id} className={styles.projCard}>
                    <div>
                      <div className={styles.projTop}>
                        <h4 className={styles.projTitle}>{proj.title}</h4>
                        <div className={styles.projActions}>
                          <button
                            onClick={() => openEditProjectModal(proj)}
                            className={styles.iconBtn}
                            title="Editar Projeto"
                          >
                            <Edit3Icon className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className={styles.iconBtnDanger}
                            title="Excluir Projeto"
                          >
                            <Trash2Icon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className={styles.projDesc}>{proj.description}</p>
                    </div>

                    <div className={styles.projFooter}>
                      <div className={styles.stackWrap}>
                        {proj.stack?.slice(0, 2).map((s, i) => (
                          <span key={i} className={cn('chip-river', styles.stackChip)}>
                            {s}
                          </span>
                        ))}
                      </div>
                      {proj.links?.demo || proj.links?.github ? (
                        <a
                          href={proj.links.demo || proj.links.github}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.projLink}
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
        <div className={styles.modalOverlay}>
          <div className={cn('manaus-card', styles.modalCard)}>
            <h3 className={styles.modalTitle}>
              {editingProjectId ? 'Editar Projeto' : 'Publicar Novo Projeto'}
            </h3>
            <form onSubmit={handleSaveProject} className={styles.modalForm}>
              <div>
                <label className={styles.label}>Título do Projeto</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: RioTech Maps"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className={cn('manaus-input', styles.input)}
                />
              </div>

              <div>
                <label className={styles.label}>Descrição</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Descreva o propósito do projeto e impacto regional..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className={cn('manaus-input', styles.input)}
                />
              </div>

              <div>
                <label className={styles.label}>Stack (separadas por vírgula)</label>
                <input
                  type="text"
                  placeholder="Next.js, Supabase, Tailwind, TypeScript"
                  value={formStack}
                  onChange={(e) => setFormStack(e.target.value)}
                  className={cn('manaus-input', styles.input)}
                />
              </div>

              <div>
                <label className={styles.label}>URL da Imagem / Screenshot (Preview)</label>
                <input
                  type="url"
                  placeholder="https://exemplo.com/preview.png"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className={cn('manaus-input', styles.input)}
                />
              </div>

              <div className={styles.row2}>
                <div>
                  <label className={styles.label}>Link GitHub</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={formGithub}
                    onChange={(e) => setFormGithub(e.target.value)}
                    className={cn('manaus-input', styles.input)}
                  />
                </div>
                <div>
                  <label className={styles.label}>Demo / Site</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formDemo}
                    onChange={(e) => setFormDemo(e.target.value)}
                    className={cn('manaus-input', styles.input)}
                  />
                </div>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className={styles.cancelBtn}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submittingProj}
                  className={cn('btn-leaf', styles.modalSubmit)}
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
