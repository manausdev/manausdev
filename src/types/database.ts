export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProfileType = 'dev' | 'empresa' | 'admin';

export type Profile = {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string | null;
  role?: string | null;
  profile_type?: ProfileType | null;
  bio?: string | null;
  location?: string | null;
  city?: string | null;
  seniority?: string | null;
  availability?: string | null;
  skills?: string[] | null;
  github?: string | null;
  website?: string | null;
  linkedin?: string | null;
  is_admin?: boolean | null;
  created_at?: string;
  updated_at?: string;
}

export type Skill = {
  id: string;
  slug: string;
  name: string;
  category?: string | null;
  created_at?: string;
}

export type PersonSkill = {
  person_id: string;
  skill_id: string;
  level?: string | null;
  years?: number | null;
  created_at?: string;
}

export type JobSkill = {
  job_id: string;
  skill_id: string;
}

export interface ProjectLinks {
  github?: string;
  demo?: string;
  website?: string;
}

export type Project = {
  id: string;
  title: string;
  description: string;
  stack?: string[] | null;
  links?: ProjectLinks | null;
  image_url?: string | null;
  featured?: boolean | null;
  author_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type OrgType = 'company' | 'university' | 'research' | 'government' | 'nonprofit' | 'collective';

export type Company = {
  id: string;
  name: string;
  org_type?: OrgType | null;
  industry?: string | null;
  location?: string | null;
  size?: string | null;
  website?: string | null;
  logo_url?: string | null;
  image_url?: string | null;
  description?: string | null;
  created_by?: string | null;
  created_at?: string;
}

export type Community = {
  id: string;
  name: string;
  description: string;
  members_count?: number | null;
  type?: string | null;
  links?: Record<string, string> | null;
  logo_url?: string | null;
  image_url?: string | null;
  created_at?: string;
}

export type EventItem = {
  id: string;
  title: string;
  description?: string | null;
  date: string;
  location: string;
  type?: string | null;
  link?: string | null;
  image_url?: string | null;
  organizer_id?: string | null;
  created_at?: string;
}

export type Job = {
  id: string;
  title: string;
  description?: string | null;
  company_id?: string | null;
  company_name?: string | null;
  type?: string | null;
  remote?: boolean | null;
  salary?: string | null;
  link?: string | null;
  location?: string | null;
  skills?: string[] | null;
  posted_by?: string | null;
  created_at?: string;
}

export type NewsCategory = 'geral' | 'evento' | 'vaga' | 'lancamento' | 'analise';

export type NewsItem = {
  id: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  image_url?: string | null;
  category?: NewsCategory | null;
  published?: boolean | null;
  published_at?: string | null;
  author_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type ChannelPlatform = 'discord' | 'telegram' | 'whatsapp' | 'matrix';

export type CommunityChannel = {
  id: string;
  community_id: string;
  name: string;
  description?: string | null;
  platform?: ChannelPlatform | null;
  url?: string | null;
  members_count?: number | null;
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status?: string | null;
  created_at?: string;
}

export type Badge = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  criteria_json?: Json | null;
  icon?: string | null;
  created_at?: string;
}

export type UserBadge = {
  user_id: string;
  badge_id: string;
  awarded_at?: string;
  evidence_json?: Json | null;
}

export type ReputationEvent = {
  id: string;
  user_id: string;
  type: string;
  source_table: string;
  source_id: string;
  points: number;
  metadata?: Json | null;
  created_at?: string;
}

export type Report = {
  id: string;
  reporter_id?: string | null;
  target_type: string;
  target_id: string;
  reason: string;
  status?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at?: string;
}

export type Verification = {
  id: string;
  user_id: string;
  type: string;
  status?: string | null;
  evidence_url?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at?: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          username: string;
          full_name: string;
          avatar_url?: string | null;
          role?: string | null;
          profile_type?: ProfileType | null;
          bio?: string | null;
          location?: string | null;
          city?: string | null;
          seniority?: string | null;
          availability?: string | null;
          skills?: string[] | null;
          github?: string | null;
          website?: string | null;
          linkedin?: string | null;
          is_admin?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string;
          avatar_url?: string | null;
          role?: string | null;
          profile_type?: ProfileType | null;
          bio?: string | null;
          location?: string | null;
          city?: string | null;
          seniority?: string | null;
          availability?: string | null;
          skills?: string[] | null;
          github?: string | null;
          website?: string | null;
          linkedin?: string | null;
          is_admin?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      projects: {
        Row: Project;
        Insert: {
          id?: string;
          title: string;
          description: string;
          stack?: string[] | null;
          links?: ProjectLinks | null;
          image_url?: string | null;
          featured?: boolean | null;
          author_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          stack?: string[] | null;
          links?: ProjectLinks | null;
          image_url?: string | null;
          featured?: boolean | null;
          author_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'projects_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      companies: {
        Row: Company;
        Insert: {
          id?: string;
          name: string;
          org_type?: OrgType | null;
          industry?: string | null;
          location?: string | null;
          size?: string | null;
          website?: string | null;
          logo_url?: string | null;
          image_url?: string | null;
          description?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          org_type?: OrgType | null;
          industry?: string | null;
          location?: string | null;
          size?: string | null;
          website?: string | null;
          logo_url?: string | null;
          image_url?: string | null;
          description?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'companies_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      communities: {
        Row: Community;
        Insert: {
          id?: string;
          name: string;
          description: string;
          members_count?: number | null;
          type?: string | null;
          links?: Record<string, string> | null;
          logo_url?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          members_count?: number | null;
          type?: string | null;
          links?: Record<string, string> | null;
          logo_url?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Relationships: {
          foreignKeyName: string;
          columns: string[];
          isOneToOne?: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }[];
      };
      events: {
        Row: EventItem;
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          date: string;
          location: string;
          type?: string | null;
          link?: string | null;
          image_url?: string | null;
          organizer_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          date?: string;
          location?: string;
          type?: string | null;
          link?: string | null;
          image_url?: string | null;
          organizer_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'events_organizer_id_fkey';
            columns: ['organizer_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      jobs: {
        Row: Job;
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          company_id?: string | null;
          company_name?: string | null;
          type?: string | null;
          remote?: boolean | null;
          salary?: string | null;
          link?: string | null;
          location?: string | null;
          skills?: string[] | null;
          posted_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          company_id?: string | null;
          company_name?: string | null;
          type?: string | null;
          remote?: boolean | null;
          salary?: string | null;
          link?: string | null;
          location?: string | null;
          skills?: string[] | null;
          posted_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'jobs_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'jobs_posted_by_fkey';
            columns: ['posted_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      news: {
        Row: NewsItem;
        Insert: {
          id?: string;
          title: string;
          excerpt?: string | null;
          content?: string | null;
          image_url?: string | null;
          category?: NewsCategory | null;
          published?: boolean | null;
          published_at?: string | null;
          author_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          excerpt?: string | null;
          content?: string | null;
          image_url?: string | null;
          category?: NewsCategory | null;
          published?: boolean | null;
          published_at?: string | null;
          author_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'news_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      community_channels: {
        Row: CommunityChannel;
        Insert: {
          id?: string;
          community_id: string;
          name: string;
          description?: string | null;
          platform?: ChannelPlatform | null;
          url?: string | null;
          members_count?: number | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          community_id?: string;
          name?: string;
          description?: string | null;
          platform?: ChannelPlatform | null;
          url?: string | null;
          members_count?: number | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'community_channels_community_id_fkey';
            columns: ['community_id'];
            isOneToOne: false;
            referencedRelation: 'communities';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'community_channels_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      skills: {
        Row: Skill;
        Insert: {
          id?: string;
          slug: string;
          name: string;
          category?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          category?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      person_skills: {
        Row: PersonSkill;
        Insert: {
          person_id: string;
          skill_id: string;
          level?: string | null;
          years?: number | null;
          created_at?: string;
        };
        Update: {
          person_id?: string;
          skill_id?: string;
          level?: string | null;
          years?: number | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'person_skills_person_id_fkey';
            columns: ['person_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'person_skills_skill_id_fkey';
            columns: ['skill_id'];
            isOneToOne: false;
            referencedRelation: 'skills';
            referencedColumns: ['id'];
          },
        ];
      };
      job_skills: {
        Row: JobSkill;
        Insert: {
          job_id: string;
          skill_id: string;
        };
        Update: {
          job_id?: string;
          skill_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'job_skills_job_id_fkey';
            columns: ['job_id'];
            isOneToOne: false;
            referencedRelation: 'jobs';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'job_skills_skill_id_fkey';
            columns: ['skill_id'];
            isOneToOne: false;
            referencedRelation: 'skills';
            referencedColumns: ['id'];
          },
        ];
      };
      contacts: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          status: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          status?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string;
          message?: string;
          status?: string | null;
          created_at?: string;
        };
        Relationships: {
          foreignKeyName: string;
          columns: string[];
          isOneToOne?: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }[];
      };
      badges: {
        Row: Badge;
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          criteria_json?: Json | null;
          icon?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          criteria_json?: Json | null;
          icon?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      user_badges: {
        Row: UserBadge;
        Insert: {
          user_id: string;
          badge_id: string;
          awarded_at?: string;
          evidence_json?: Json | null;
        };
        Update: {
          user_id?: string;
          badge_id?: string;
          awarded_at?: string;
          evidence_json?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: 'user_badges_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_badges_badge_id_fkey';
            columns: ['badge_id'];
            isOneToOne: false;
            referencedRelation: 'badges';
            referencedColumns: ['id'];
          },
        ];
      };
      reputation_events: {
        Row: ReputationEvent;
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          source_table: string;
          source_id: string;
          points: number;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          source_table?: string;
          source_id?: string;
          points?: number;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'reputation_events_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      reports: {
        Row: Report;
        Insert: {
          id?: string;
          reporter_id?: string | null;
          target_type: string;
          target_id: string;
          reason: string;
          status?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          reporter_id?: string | null;
          target_type?: string;
          target_id?: string;
          reason?: string;
          status?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'reports_reporter_id_fkey';
            columns: ['reporter_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reports_reviewed_by_fkey';
            columns: ['reviewed_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      verifications: {
        Row: Verification;
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          status?: string | null;
          evidence_url?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          status?: string | null;
          evidence_url?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'verifications_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'verifications_reviewed_by_fkey';
            columns: ['reviewed_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      insert_contact_safe: {
        Args: {
          p_name: string;
          p_email: string;
          p_subject: string;
          p_message: string;
        };
        Returns: undefined;
      };
      delete_account: {
        Args: Record<string, never>;
        Returns: undefined;
      };
      export_user_data: {
        Args: Record<string, never>;
        Returns: Json;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
