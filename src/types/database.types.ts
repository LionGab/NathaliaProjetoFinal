/**
 * Supabase Database Types
 * Auto-generated from supabase-setup.sql schema
 * Last updated: 2025-12-17
 */

// ============================================
// TABLE TYPES
// ============================================

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          stage: string;
          age: number;
          location: string;
          goals: string[];
          challenges: string[];
          support_network: string[];
          communication_preference: string;
          interests: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          stage: string;
          age: number;
          location: string;
          goals?: string[];
          challenges?: string[];
          support_network?: string[];
          communication_preference: string;
          interests?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          stage?: string;
          age?: number;
          location?: string;
          goals?: string[];
          challenges?: string[];
          support_network?: string[];
          communication_preference?: string;
          interests?: string[];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "users_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          author_name: string;
          content: string;
          category: string;
          likes_count: number;
          comments_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          author_name: string;
          content: string;
          category: string;
          likes_count?: number;
          comments_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          author_name?: string;
          content?: string;
          category?: string;
          likes_count?: number;
          comments_count?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          author_name: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          author_name: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          author_name?: string;
          content?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey";
            columns: ["post_id"];
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      likes: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: never;
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey";
            columns: ["post_id"];
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "likes_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          emoji: string;
          current_streak: number;
          best_streak: number;
          total_completions: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          emoji: string;
          current_streak?: number;
          best_streak?: number;
          total_completions?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          emoji?: string;
          current_streak?: number;
          best_streak?: number;
          total_completions?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "habits_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      habit_completions: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          completed_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          user_id: string;
          completed_date: string;
          created_at?: string;
        };
        Update: never;
        Relationships: [
          {
            foreignKeyName: "habit_completions_habit_id_fkey";
            columns: ["habit_id"];
            referencedRelation: "habits";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "habit_completions_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_comments_count: {
        Args: { post_id: string };
        Returns: undefined;
      };
      increment_likes_count: {
        Args: { post_id: string };
        Returns: undefined;
      };
      decrement_likes_count: {
        Args: { post_id: string };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// ============================================
// HELPER TYPES
// ============================================

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

// ============================================
// CONVENIENCE ALIASES
// ============================================

export type User = Tables<"users">;
export type UserInsert = InsertTables<"users">;
export type UserUpdate = UpdateTables<"users">;

export type Post = Tables<"posts">;
export type PostInsert = InsertTables<"posts">;
export type PostUpdate = UpdateTables<"posts">;

export type Comment = Tables<"comments">;
export type CommentInsert = InsertTables<"comments">;
export type CommentUpdate = UpdateTables<"comments">;

export type Like = Tables<"likes">;
export type LikeInsert = InsertTables<"likes">;

export type Habit = Tables<"habits">;
export type HabitInsert = InsertTables<"habits">;
export type HabitUpdate = UpdateTables<"habits">;

export type HabitCompletion = Tables<"habit_completions">;
export type HabitCompletionInsert = InsertTables<"habit_completions">;
