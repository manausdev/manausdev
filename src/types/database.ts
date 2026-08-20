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

export interface Project {
  id: string;
  title: string;
  description: string;
  stack?: string[] | null;
  links?: {
    github?: string;
    demo?: string;
    website?: string;
  } | null;
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

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string; username: string; full_name: string };
        Update: Partial<Profile>;
        Relationships: [];
      };
      projects: {
        Row: Project;
        Insert: Partial<Project> & { title: string; description: string };
        Update: Partial<Project>;
        Relationships: [];
      };
      companies: {
        Row: Company;
        Insert: Partial<Company> & { name: string };
        Update: Partial<Company>;
        Relationships: [];
      };
      communities: {
        Row: Community;
        Insert: Partial<Community> & { name: string; description: string };
        Update: Partial<Community>;
        Relationships: [];
      };
      events: {
        Row: EventItem;
        Insert: Partial<EventItem> & { title: string; date: string; location: string };
        Update: Partial<EventItem>;
        Relationships: [];
      };
      jobs: {
        Row: Job;
        Insert: Partial<Job> & { title: string };
        Update: Partial<Job>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
