import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY') {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("Error initializing Supabase client:", error);
  }
} else {
  console.warn("Supabase environment variables not set. App is running in mock mode. Please update your .env file.");
}

export { supabase };

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url?: string;
          role: 'admin' | 'user';
          department?: string;
          year?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          avatar_url?: string;
          role?: 'admin' | 'user';
          department?: string;
          year?: string;
        };
        Update: {
          email?: string;
          name?: string;
          avatar_url?: string;
          role?: 'admin' | 'user';
          department?: string;
          year?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          date: string;
          time: string;
          location: string;
          category: string;
          organizer_id: string;
          max_attendees?: number;
          image_url?: string;
          tags: string[];
          status: 'upcoming' | 'ongoing' | 'completed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          date: string;
          time: string;
          location: string;
          category: string;
          organizer_id: string;
          max_attendees?: number;
          image_url?: string;
          tags?: string[];
          status?: 'upcoming' | 'ongoing' | 'completed';
        };
        Update: {
          title?: string;
          description?: string;
          date?: string;
          time?: string;
          location?: string;
          category?: string;
          max_attendees?: number;
          image_url?: string;
          tags?: string[];
          status?: 'upcoming' | 'ongoing' | 'completed';
        };
      };
      event_attendees: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          event_id: string;
          user_id: string;
        };
        Update: {};
      };
    };
  };
}
