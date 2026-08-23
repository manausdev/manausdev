export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  email?: string | null;
  avatar_url?: string | null;
  role?: string | null;
  bio?: string | null;
  location?: string | null;
  skills?: string[] | null;
  github?: string | null;
  website?: string | null;
  linkedin?: string | null;
  available?: boolean | null;
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
          email?: string | null;
          avatar_url?: string | null;
          role?: string | null;
          bio?: string | null;
          location?: string | null;
          skills?: string[] | null;
          github?: string | null;
          website?: string | null;
          linkedin?: string | null;
          available?: boolean | null;
          is_admin?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string;
          email?: string | null;
          avatar_url?: string | null;
          role?: string | null;
          bio?: string | null;
          location?: string | null;
          skills?: string[] | null;
          github?: string | null;
          website?: string | null;
          linkedin?: string | null;
          available?: boolean | null;
          is_admin?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: {
          foreignKeyName: string;
          columns: string[];
          isOneToOne?: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }[];
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
        Relationships: {
          foreignKeyName: string;
          columns: string[];
          isOneToOne?: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }[];
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
        Relationships: {
          foreignKeyName: string;
          columns: string[];
          isOneToOne?: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }[];
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
        Relationships: {
          foreignKeyName: string;
          columns: string[];
          isOneToOne?: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }[];
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
        Relationships: {
          foreignKeyName: string;
          columns: string[];
          isOneToOne?: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }[];
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
