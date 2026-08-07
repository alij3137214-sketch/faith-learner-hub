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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          code: string
          coin_reward: number
          created_at: string
          description: string | null
          icon: string
          id: string
          tier: string
          title: string
          xp_reward: number
        }
        Insert: {
          code: string
          coin_reward?: number
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          tier?: string
          title: string
          xp_reward?: number
        }
        Update: {
          code?: string
          coin_reward?: number
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          tier?: string
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
      avatar_items: {
        Row: {
          active: boolean
          code: string
          coin_cost: number
          id: string
          name: string
          preview_url: string | null
          rarity: string
          slot: string
          sort_order: number
          unlock_type: string
          unlock_value: number
          value: string
        }
        Insert: {
          active?: boolean
          code: string
          coin_cost?: number
          id?: string
          name: string
          preview_url?: string | null
          rarity?: string
          slot: string
          sort_order?: number
          unlock_type?: string
          unlock_value?: number
          value?: string
        }
        Update: {
          active?: boolean
          code?: string
          coin_cost?: number
          id?: string
          name?: string
          preview_url?: string | null
          rarity?: string
          slot?: string
          sort_order?: number
          unlock_type?: string
          unlock_value?: number
          value?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          body: string
          category: string | null
          cover_image_url: string | null
          created_at: string
          id: string
          language: string
          published: boolean
          published_at: string | null
          reading_minutes: number
          scholar_id: string | null
          source: string | null
          summary: string | null
          tags: string[]
          title: string
          topic: string | null
          type: Database["public"]["Enums"]["doc_type"]
          updated_at: string
          xp_reward: number
        }
        Insert: {
          body?: string
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          id?: string
          language?: string
          published?: boolean
          published_at?: string | null
          reading_minutes?: number
          scholar_id?: string | null
          source?: string | null
          summary?: string | null
          tags?: string[]
          title: string
          topic?: string | null
          type?: Database["public"]["Enums"]["doc_type"]
          updated_at?: string
          xp_reward?: number
        }
        Update: {
          body?: string
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          id?: string
          language?: string
          published?: boolean
          published_at?: string | null
          reading_minutes?: number
          scholar_id?: string | null
          source?: string | null
          summary?: string | null
          tags?: string[]
          title?: string
          topic?: string | null
          type?: Database["public"]["Enums"]["doc_type"]
          updated_at?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "documents_scholar_id_fkey"
            columns: ["scholar_id"]
            isOneToOne: false
            referencedRelation: "scholars"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_paths: {
        Row: {
          coin_reward: number
          cover_image_url: string | null
          created_at: string
          description: string | null
          difficulty: string
          id: string
          published: boolean
          scholar_id: string | null
          slug: string
          sort_order: number
          title: string
          updated_at: string
          xp_reward: number
        }
        Insert: {
          coin_reward?: number
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string
          id?: string
          published?: boolean
          scholar_id?: string | null
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
          xp_reward?: number
        }
        Update: {
          coin_reward?: number
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string
          id?: string
          published?: boolean
          scholar_id?: string | null
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "learning_paths_scholar_id_fkey"
            columns: ["scholar_id"]
            isOneToOne: false
            referencedRelation: "scholars"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          active: boolean
          cadence: string
          code: string
          coin_reward: number
          created_at: string
          description: string | null
          id: string
          target: number
          title: string
          xp_reward: number
        }
        Insert: {
          active?: boolean
          cadence?: string
          code: string
          coin_reward?: number
          created_at?: string
          description?: string | null
          id?: string
          target?: number
          title: string
          xp_reward?: number
        }
        Update: {
          active?: boolean
          cadence?: string
          code?: string
          coin_reward?: number
          created_at?: string
          description?: string | null
          id?: string
          target?: number
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
      path_items: {
        Row: {
          content: string | null
          created_at: string
          document_id: string | null
          id: string
          kind: Database["public"]["Enums"]["path_item_kind"]
          path_id: string
          position: number
          quiz_id: string | null
          title: string
          xp_reward: number
        }
        Insert: {
          content?: string | null
          created_at?: string
          document_id?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["path_item_kind"]
          path_id: string
          position?: number
          quiz_id?: string | null
          title: string
          xp_reward?: number
        }
        Update: {
          content?: string | null
          created_at?: string
          document_id?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["path_item_kind"]
          path_id?: string
          position?: number
          quiz_id?: string | null
          title?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "path_items_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "path_items_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_config: Json
          coins: number
          created_at: string
          disclaimer_accepted: boolean
          display_name: string
          id: string
          last_active_date: string | null
          level: number
          scholar_title: string
          streak: number
          suspended: boolean
          updated_at: string
          user_id: string
          xp: number
        }
        Insert: {
          avatar_config?: Json
          coins?: number
          created_at?: string
          disclaimer_accepted?: boolean
          display_name?: string
          id?: string
          last_active_date?: string | null
          level?: number
          scholar_title?: string
          streak?: number
          suspended?: boolean
          updated_at?: string
          user_id: string
          xp?: number
        }
        Update: {
          avatar_config?: Json
          coins?: number
          created_at?: string
          disclaimer_accepted?: boolean
          display_name?: string
          id?: string
          last_active_date?: string | null
          level?: number
          scholar_title?: string
          streak?: number
          suspended?: boolean
          updated_at?: string
          user_id?: string
          xp?: number
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          answer: string
          explanation: string | null
          id: string
          kind: Database["public"]["Enums"]["question_kind"]
          options: string[]
          position: number
          prompt: string
          quiz_id: string
        }
        Insert: {
          answer: string
          explanation?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["question_kind"]
          options?: string[]
          position?: number
          prompt: string
          quiz_id: string
        }
        Update: {
          answer?: string
          explanation?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["question_kind"]
          options?: string[]
          position?: number
          prompt?: string
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string
          description: string | null
          document_id: string | null
          id: string
          published: boolean
          scholar_id: string | null
          title: string
          topic: string | null
          updated_at: string
          xp_reward: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          document_id?: string | null
          id?: string
          published?: boolean
          scholar_id?: string | null
          title: string
          topic?: string | null
          updated_at?: string
          xp_reward?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          document_id?: string | null
          id?: string
          published?: boolean
          scholar_id?: string | null
          title?: string
          topic?: string | null
          updated_at?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_scholar_id_fkey"
            columns: ["scholar_id"]
            isOneToOne: false
            referencedRelation: "scholars"
            referencedColumns: ["id"]
          },
        ]
      }
      scholars: {
        Row: {
          accent_color: string | null
          biography: string | null
          cover_image_url: string | null
          created_at: string
          era: string | null
          id: string
          name: string
          published: boolean
          slug: string
          sort_order: number
          title: string | null
          updated_at: string
        }
        Insert: {
          accent_color?: string | null
          biography?: string | null
          cover_image_url?: string | null
          created_at?: string
          era?: string | null
          id?: string
          name: string
          published?: boolean
          slug: string
          sort_order?: number
          title?: string | null
          updated_at?: string
        }
        Update: {
          accent_color?: string | null
          biography?: string | null
          cover_image_url?: string | null
          created_at?: string
          era?: string | null
          id?: string
          name?: string
          published?: boolean
          slug?: string
          sort_order?: number
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_avatar_items: {
        Row: {
          id: string
          item_id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          id?: string
          item_id: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          id?: string
          item_id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_avatar_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "avatar_items"
            referencedColumns: ["id"]
          },
        ]
      }
      user_missions: {
        Row: {
          completed: boolean
          id: string
          mission_id: string
          period_key: string
          progress: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          id?: string
          mission_id: string
          period_key: string
          progress?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          id?: string
          mission_id?: string
          period_key?: string
          progress?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_missions_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed: boolean
          document_id: string | null
          id: string
          last_read_at: string
          path_item_id: string | null
          percent: number
          user_id: string
        }
        Insert: {
          completed?: boolean
          document_id?: string | null
          id?: string
          last_read_at?: string
          path_item_id?: string | null
          percent?: number
          user_id: string
        }
        Update: {
          completed?: boolean
          document_id?: string | null
          id?: string
          last_read_at?: string
          path_item_id?: string | null
          percent?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_path_item_id_fkey"
            columns: ["path_item_id"]
            isOneToOne: false
            referencedRelation: "path_items"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      doc_type:
        | "book"
        | "speech"
        | "article"
        | "letter"
        | "interview"
        | "statement"
        | "qa"
      path_item_kind: "lesson" | "document" | "reflection" | "quiz" | "reward"
      question_kind: "mcq" | "truefalse" | "fill_blank" | "short_answer"
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
      app_role: ["admin", "user"],
      doc_type: [
        "book",
        "speech",
        "article",
        "letter",
        "interview",
        "statement",
        "qa",
      ],
      path_item_kind: ["lesson", "document", "reflection", "quiz", "reward"],
      question_kind: ["mcq", "truefalse", "fill_blank", "short_answer"],
    },
  },
} as const
