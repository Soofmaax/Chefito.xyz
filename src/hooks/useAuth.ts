'use client';

import { useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { User } from '@/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        // Silent error handling for production
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return;
      }
      
      setUser(data);
    } catch (error) {
      // Silent error handling for production
      setUser(null);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!isSupabaseConfigured()) {
      return null;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            full_name: fullName,
            skill_level: 'beginner',
            dietary_restrictions: [],
            subscription_status: 'free'
          });

        if (profileError) {
          throw profileError;
        }
      }
      
      return data.user;
    } catch (error: any) {
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      return null;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      return data.user;
    } catch (error: any) {
      throw error;
    }
  };

  const signOut = async () => {
    if (!isSupabaseConfigured()) {
      setUser(null);
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
    } catch (error: any) {
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!isSupabaseConfigured() || !user) {
      return null;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          ...updates, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', user.id);

      if (error) throw error;

      setUser({ ...user, ...updates });
      return { ...user, ...updates };
    } catch (error: any) {
      throw error;
    }
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isSupabaseConfigured: isSupabaseConfigured(),
    isPostgreSQLMode: true, // Always true since we're using PostgreSQL for recipes
  };
};