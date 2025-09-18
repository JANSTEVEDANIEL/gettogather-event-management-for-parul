import { supabase } from '../lib/supabase';
import { User } from '../types';

export class AuthService {
  async signInWithGoogle() {
    if (!supabase) {
      console.warn("signInWithGoogle called in mock mode.");
      alert("Supabase is not configured. Cannot sign in with Google.");
      return { data: null, error: new Error("Supabase not configured.") };
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) throw error;
    return data;
  }

  async signInWithEmail(email: string, password: string) {
    if (!supabase) {
      console.warn("signInWithEmail called in mock mode.");
      return { data: null, error: new Error("Supabase not configured.") };
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  }

  async signUp(email: string, password: string, userData: Partial<User>) {
    if (!supabase) {
      console.warn("signUp called in mock mode.");
      return { data: null, error: new Error("Supabase not configured.") };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    if (error) throw error;
    return data;
  }

  async signOut() {
    if (!supabase) {
      console.warn("signOut called in mock mode.");
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser() {
    if (!supabase) {
      console.warn("getCurrentUser called in mock mode.");
      return null;
    }
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }

  async updateProfile(userId: string, updates: Partial<User>) {
    if (!supabase) {
      console.warn("updateProfile called in mock mode.");
      return null;
    }
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  onAuthStateChange(callback: (user: any) => void) {
    if (!supabase) {
      console.warn("onAuthStateChange called in mock mode.");
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null);
    });
  }
}

export const authService = new AuthService();
