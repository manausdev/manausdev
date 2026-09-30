export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProfileType = 'dev' | 'empresa' | 'admin';

export interface Profile {
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

export interface ProjectLinks {
  github?: string;
  demo?: string;
  website?: string;
}

export interface Project {
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

export interface Company {
  id: string;
  name: string;
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

export interface Community {
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

export interface EventItem {
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

export interface Job {
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

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status?: string | null;
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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
