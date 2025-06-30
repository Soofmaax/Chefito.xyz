export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          skill_level: 'beginner' | 'intermediate' | 'advanced' | 'professional'
          dietary_restrictions: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          skill_level?: 'beginner' | 'intermediate' | 'advanced' | 'professional'
          dietary_restrictions?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          skill_level?: 'beginner' | 'intermediate' | 'advanced' | 'professional'
          dietary_restrictions?: string[]
          updated_at?: string
        }
      }
      recipes: {
        Row: {
          id: string
          title: string
          description: string
          image_url: string
          prep_time: number
          cook_time: number
          total_time: number
          servings: number
          difficulty: 'easy' | 'medium' | 'hard'
          rating: number
          category: string
          cuisine: string
          tags: string[]
          created_by: string
          video_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          image_url: string
          prep_time: number
          cook_time: number
          total_time: number
          servings: number
          difficulty: 'easy' | 'medium' | 'hard'
          rating?: number
          category: string
          cuisine: string
          tags?: string[]
          created_by: string
          video_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string
          image_url?: string
          prep_time?: number
          cook_time?: number
          total_time?: number
          servings?: number
          difficulty?: 'easy' | 'medium' | 'hard'
          rating?: number
          category?: string
          cuisine?: string
          tags?: string[]
          video_url?: string | null
          updated_at?: string
        }
      }
      ingredients: {
        Row: {
          id: string
          recipe_id: string
          name: string
          amount: number
          unit: string
          notes: string | null
          optional: boolean
          order_index: number
        }
        Insert: {
          id?: string
          recipe_id: string
          name: string
          amount: number
          unit: string
          notes?: string | null
          optional?: boolean
          order_index: number
        }
        Update: {
          name?: string
          amount?: number
          unit?: string
          notes?: string | null
          optional?: boolean
          order_index?: number
        }
      }
      instructions: {
        Row: {
          id: string
          recipe_id: string
          step_number: number
          title: string
          description: string
          duration: number | null
          temperature: number | null
          image_url: string | null
          voice_url: string | null
        }
        Insert: {
          id?: string
          recipe_id: string
          step_number: number
          title: string
          description: string
          duration?: number | null
          temperature?: number | null
          image_url?: string | null
          voice_url?: string | null
        }
        Update: {
          step_number?: number
          title?: string
          description?: string
          duration?: number | null
          temperature?: number | null
          image_url?: string | null
          voice_url?: string | null
        }
      }
      cooking_sessions: {
        Row: {
          id: string
          recipe_id: string
          user_id: string
          current_step: number
          status: 'not_started' | 'in_progress' | 'paused' | 'completed'
          started_at: string | null
          completed_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          user_id: string
          current_step?: number
          status?: 'not_started' | 'in_progress' | 'paused' | 'completed'
          started_at?: string | null
          completed_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          current_step?: number
          status?: 'not_started' | 'in_progress' | 'paused' | 'completed'
          started_at?: string | null
          completed_at?: string | null
          notes?: string | null
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}