export type ResourceType = "free" | "paid";

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
  created_at: string;
  updated_at: string;
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
        Update: Partial<Omit<Resource, "id" | "created_at">>;
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
      resource_type: ResourceType;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
