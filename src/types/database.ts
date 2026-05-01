export type ResourceType = "free" | "paid";
export type MediaType = "image" | "video";
export type EventType = "view" | "share" | "click";
export type AdminRole = "admin" | "editor" | "viewer";

export interface Resource {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  type: ResourceType;
  image: string;
  content: string;
  published_at: string;
  read_time: string;
  price: number | null;
  is_published: boolean;
  author_email: string | null;
  featured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: string;
  resource_id: string | null;
  url: string;
  type: MediaType;
  filename: string;
  size_bytes: number | null;
  mime_type: string | null;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
  created_at: string;
}

export interface Analytics {
  id: string;
  resource_id: string;
  event_type: EventType;
  platform: string | null;
  created_at: string;
}

export interface ResourceStats {
  views_count: number;
  shares_count: number;
  facebook_shares: number;
  linkedin_shares: number;
  twitter_shares: number;
}

export type Database = {
  public: {
    Tables: {
      resources: {
        Row: Resource;
        Insert: Omit<Resource, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Resource, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      media: {
        Row: Media;
        Insert: Omit<Media, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Media, "id" | "created_at">>;
        Relationships: [
          {
            foreignKeyName: "media_resource_id_fkey";
            columns: ["resource_id"];
            referencedRelation: "resources";
            referencedColumns: ["id"];
          }
        ];
      };
      admin_users: {
        Row: AdminUser;
        Insert: Omit<AdminUser, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<AdminUser, "id" | "created_at">>;
        Relationships: [];
      };
      analytics: {
        Row: Analytics;
        Insert: Omit<Analytics, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Analytics, "id" | "created_at">>;
        Relationships: [
          {
            foreignKeyName: "analytics_resource_id_fkey";
            columns: ["resource_id"];
            referencedRelation: "resources";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_resource_stats: {
        Args: { resource_uuid: string };
        Returns: ResourceStats[];
      };
    };
    Enums: {
      resource_type: ResourceType;
      media_type: MediaType;
      event_type: EventType;
      admin_role: AdminRole;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
