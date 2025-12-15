export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          app_id: string
          country: string | null
          created_at: string
          event_type: string
          id: string
          source: string | null
        }
        Insert: {
          app_id: string
          country?: string | null
          created_at?: string
          event_type: string
          id?: string
          source?: string | null
        }
        Update: {
          app_id?: string
          country?: string | null
          created_at?: string
          event_type?: string
          id?: string
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["id"]
          },
        ]
      }
      app_history: {
        Row: {
          action_type: string
          app_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          action_type: string
          app_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          action_type?: string
          app_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_history_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      app_screenshots: {
        Row: {
          app_id: string
          created_at: string
          id: string
          image_url: string
          sort_order: number | null
        }
        Insert: {
          app_id: string
          created_at?: string
          id?: string
          image_url: string
          sort_order?: number | null
        }
        Update: {
          app_id?: string
          created_at?: string
          id?: string
          image_url?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "app_screenshots_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["id"]
          },
        ]
      }
      apps: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          developer_id: string
          icon_url: string | null
          id: string
          install_count: number | null
          is_featured: boolean | null
          manifest_url: string | null
          name: string
          privacy_policy_url: string | null
          pwa_installable: boolean | null
          pwa_offline: boolean | null
          pwa_push_notifications: boolean | null
          slug: string
          status: Database["public"]["Enums"]["app_status"]
          support_url: string | null
          tagline: string | null
          tags: string[] | null
          updated_at: string
          view_count: number | null
          website_url: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          developer_id: string
          icon_url?: string | null
          id?: string
          install_count?: number | null
          is_featured?: boolean | null
          manifest_url?: string | null
          name: string
          privacy_policy_url?: string | null
          pwa_installable?: boolean | null
          pwa_offline?: boolean | null
          pwa_push_notifications?: boolean | null
          slug: string
          status?: Database["public"]["Enums"]["app_status"]
          support_url?: string | null
          tagline?: string | null
          tags?: string[] | null
          updated_at?: string
          view_count?: number | null
          website_url?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          developer_id?: string
          icon_url?: string | null
          id?: string
          install_count?: number | null
          is_featured?: boolean | null
          manifest_url?: string | null
          name?: string
          privacy_policy_url?: string | null
          pwa_installable?: boolean | null
          pwa_offline?: boolean | null
          pwa_push_notifications?: boolean | null
          slug?: string
          status?: Database["public"]["Enums"]["app_status"]
          support_url?: string | null
          tagline?: string | null
          tags?: string[] | null
          updated_at?: string
          view_count?: number | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "apps_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "apps_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      developers: {
        Row: {
          bio: string | null
          company_name: string | null
          created_at: string
          id: string
          is_verified: boolean | null
          support_email: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          bio?: string | null
          company_name?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean | null
          support_email?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          bio?: string | null
          company_name?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean | null
          support_email?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "developers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          app_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          app_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          app_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          app_id: string
          content: string | null
          created_at: string
          developer_response: string | null
          developer_response_at: string | null
          helpful_count: number | null
          id: string
          rating: number
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          app_id: string
          content?: string | null
          created_at?: string
          developer_response?: string | null
          developer_response_at?: string | null
          helpful_count?: number | null
          id?: string
          rating: number
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          app_id?: string
          content?: string | null
          created_at?: string
          developer_response?: string | null
          developer_response_at?: string | null
          helpful_count?: number | null
          id?: string
          rating?: number
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_status: "published" | "draft" | "suspended"
      user_role: "user" | "developer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_status: ["published", "draft", "suspended"],
      user_role: ["user", "developer"],
    },
  },
} as const
