export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      flyer_templates: {
        Row: {
          created_at: string
          id: string
          is_default: boolean
          layout_config: Json
          name: string
          theme: Database["public"]["Enums"]["sale_theme"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean
          layout_config?: Json
          name: string
          theme: Database["public"]["Enums"]["sale_theme"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean
          layout_config?: Json
          name?: string
          theme?: Database["public"]["Enums"]["sale_theme"]
          updated_at?: string
        }
        Relationships: []
      }
      sale_products: {
        Row: {
          badge_text: string | null
          category: Database["public"]["Enums"]["product_category"]
          created_at: string
          id: string
          original_price: number
          position: number
          product_image: string | null
          product_name: string
          sale_id: string
          sale_price: number
          size: string | null
          updated_at: string
        }
        Insert: {
          badge_text?: string | null
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string
          id?: string
          original_price: number
          position?: number
          product_image?: string | null
          product_name: string
          sale_id: string
          sale_price: number
          size?: string | null
          updated_at?: string
        }
        Update: {
          badge_text?: string | null
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string
          id?: string
          original_price?: number
          position?: number
          product_image?: string | null
          product_name?: string
          sale_id?: string
          sale_price?: number
          size?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sale_products_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          accent_color: string
          background_color: string
          created_at: string
          end_date: string
          header_image: string | null
          id: string
          is_active: boolean
          name: string
          start_date: string
          theme: Database["public"]["Enums"]["sale_theme"]
          updated_at: string
        }
        Insert: {
          accent_color?: string
          background_color?: string
          created_at?: string
          end_date: string
          header_image?: string | null
          id?: string
          is_active?: boolean
          name: string
          start_date: string
          theme?: Database["public"]["Enums"]["sale_theme"]
          updated_at?: string
        }
        Update: {
          accent_color?: string
          background_color?: string
          created_at?: string
          end_date?: string
          header_image?: string | null
          id?: string
          is_active?: boolean
          name?: string
          start_date?: string
          theme?: Database["public"]["Enums"]["sale_theme"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      product_category:
        | "spirits"
        | "wine"
        | "beer"
        | "coolers"
        | "mixers"
        | "accessories"
      sale_theme:
        | "easter"
        | "halloween"
        | "victoria-day"
        | "christmas"
        | "general"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      product_category: [
        "spirits",
        "wine",
        "beer",
        "coolers",
        "mixers",
        "accessories",
      ],
      sale_theme: [
        "easter",
        "halloween",
        "victoria-day",
        "christmas",
        "general",
      ],
    },
  },
} as const
