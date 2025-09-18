import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '../types';
import { authService } from '../services/authService';
import { supabase } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const mapSupabaseUserToAppUser = (supabaseUser: SupabaseUser, profile: any): User => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email!,
    name: profile?.name || supabaseUser.user_metadata.full_name || supabaseUser.user_metadata.name || 'Gettogather User',
    avatar: profile?.avatar_url || supabaseUser.user_metadata.avatar_url,
    role: profile?.role || 'user',
    department: profile?.department,
    year: profile?.year,
  };
};

const getMockUser = (role: 'user' | 'admin' = 'user'): User => ({
  id: role === 'admin' ? 'admin-id' : 'user-id',
  email: role === 'admin' ? 'admin@paruluniversity.ac.in' : 'student@paruluniversity.ac.in',
  name: role === 'admin' ? 'Admin User' : 'Arjun Patel',
  avatar: `https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/100x100/6366f1/ffffff?text=${role === 'admin' ? 'A' : 'AP'}`,
  role,
  department: 'Computer Science',
  year: '3rd Year'
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      // Mock mode
      setIsLoading(true);
      setTimeout(() => {
        setUser(getMockUser());
        setIsLoading(false);
      }, 1000);
      return;
    }

    const handleUserSession = async (supabaseUser: SupabaseUser | null) => {
      if (!supabaseUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Upsert user profile: create if not exists, update if it does.
      // This is more robust than checking first.
      const { data: profile, error: upsertError } = await supabase
        .from('users')
        .upsert({
          id: supabaseUser.id,
          email: supabaseUser.email!,
          name: supabaseUser.user_metadata.full_name || supabaseUser.user_metadata.name,
          avatar_url: supabaseUser.user_metadata.avatar_url,
        }, { onConflict: 'id' })
        .select()
        .single();
      
      if (upsertError) {
        console.error('CRITICAL: Error upserting user profile:', upsertError);
        // Fallback to fetching existing profile if upsert fails for some reason
        const { data: existingProfile, error: selectError } = await supabase
          .from('users')
          .select('*')
          .eq('id', supabaseUser.id)
          .single();
        
        if (selectError || !existingProfile) {
          console.error('CRITICAL: Could not retrieve user profile after upsert failure.', selectError);
          setUser(null);
          setIsLoading(false);
          return;
        }
        setUser(mapSupabaseUserToAppUser(supabaseUser, existingProfile));
      } else {
        setUser(mapSupabaseUserToAppUser(supabaseUser, profile));
      }
      
      setIsLoading(false);
    };

    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await handleUserSession(session?.user ?? null);
    };

    checkInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUserSession(session?.user ?? null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    if (!supabase) {
      setTimeout(() => {
        const role = email.includes('admin') ? 'admin' : 'user';
        setUser(getMockUser(role));
        setIsLoading(false);
      }, 1500);
      return;
    }
    
    try {
      await authService.signInWithEmail(email, password);
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (!supabase) {
      setUser(null);
      return;
    }
    await authService.signOut();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
