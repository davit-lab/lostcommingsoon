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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      lostlock_bookings: {
        Row: {
          id: string
          ref_code: string
          event_date: string | null
          session_hour: string | null
          kids_count: number
          extra_kids: number
          base_price: number
          extra_kids_cost: number
          menu_items: Json
          menu_total: number
          services: Json
          services_total: number
          total_price: number
          parent_name: string
          phone: string
          notes: string | null
          status: string
          live_items: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ref_code: string
          event_date?: string | null
          session_hour?: string | null
          kids_count?: number
          extra_kids?: number
          base_price?: number
          extra_kids_cost?: number
          menu_items?: Json
          menu_total?: number
          services?: Json
          services_total?: number
          total_price?: number
          parent_name: string
          phone: string
          notes?: string | null
          status?: string
          live_items?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ref_code?: string
          event_date?: string | null
          session_hour?: string | null
          kids_count?: number
          extra_kids?: number
          base_price?: number
          extra_kids_cost?: number
          menu_items?: Json
          menu_total?: number
          services?: Json
          services_total?: number
          total_price?: number
          parent_name?: string
          phone?: string
          notes?: string | null
          status?: string
          live_items?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      lostlock_site_content: {
        Row: {
          assets: Json
          id: string
          translations: Json
          updated_at: string
        }
        Insert: {
          assets?: Json
          id?: string
          translations?: Json
          updated_at?: string
        }
        Update: {
          assets?: Json
          id?: string
          translations?: Json
          updated_at?: string
        }
        Relationships: []
      }
      lostlock_reels: {
        Row: {
          id: string
          reel_id: string
          position: number
          title: string
          description: string
          video: string
          thumbnail: string
          likes: number
          link: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reel_id: string
          position?: number
          title?: string
          description?: string
          video?: string
          thumbnail?: string
          likes?: number
          link?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reel_id?: string
          position?: number
          title?: string
          description?: string
          video?: string
          thumbnail?: string
          likes?: number
          link?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ll_admin_list_reels: {
        Args: { p_username: string; p_password: string }
        Returns: Json[]
      }
      ll_admin_save_reel: {
        Args: {
          p_username: string
          p_password: string
          p_id: string | null
          p_reel_id: string
          p_position: number
          p_title: string
          p_description: string
          p_video: string
          p_thumbnail: string
          p_likes: number
          p_link: string | null
        }
        Returns: Json[]
      }
      ll_admin_delete_reel: {
        Args: { p_username: string; p_password: string; p_id: string }
        Returns: undefined
      }
      ll_admin_get_bookings: {
        Args: { p_username: string; p_password: string }
        Returns: Json[]
      }
      ll_admin_set_booking_status: {
        Args: { p_username: string; p_password: string; p_id: string; p_status: string }
        Returns: undefined
      }
      ll_admin_set_live_items: {
        Args: { p_username: string; p_password: string; p_id: string; p_items: Json }
        Returns: undefined
      }
      ll_admin_get_setting: {
        Args: { p_username: string; p_password: string; p_key: string }
        Returns: Json
      }
      ll_admin_set_setting: {
        Args: { p_username: string; p_password: string; p_key: string; p_value: Json }
        Returns: undefined
      }
      ll_admin_send_telegram: {
        Args: { p_username: string; p_password: string; p_text: string }
        Returns: string
      }
      ll_admin_delete_booking: {
        Args: { p_username: string; p_password: string; p_id: string }
        Returns: undefined
      }
      ll_admin_create_booking: {
        Args: { p_username: string; p_password: string; p_booking: Json }
        Returns: Json[]
      }
      ll_get_booked_slots: {
        Args: { from_date?: string }
        Returns: {
          event_date: string
          session_hour: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
