import { createBrowserClient, createServerClient } from '@supabase/ssr';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client for client-side operations
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Server client for server-side operations
export const createServerSupabaseClient = () => {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get() {
        return undefined; // This will be handled by middleware
      },
      set() {
        // This will be handled by middleware
      },
      remove() {
        // This will be handled by middleware
      },
    },
  });
};

// Database table types
export interface Database {
  public: {
    Tables: {
      generations: {
        Row: {
          id: string;
          user_id: string;
          original_prompt: string;
          refined_prompt: string;
          negative_prompt: string;
          image_url: string;
          style: string;
          aspect_ratio: string;
          model_version: string;
          processing_time: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          original_prompt: string;
          refined_prompt: string;
          negative_prompt: string;
          image_url: string;
          style: string;
          aspect_ratio: string;
          model_version: string;
          processing_time?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          original_prompt?: string;
          refined_prompt?: string;
          negative_prompt?: string;
          image_url?: string;
          style?: string;
          aspect_ratio?: string;
          model_version?: string;
          processing_time?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
