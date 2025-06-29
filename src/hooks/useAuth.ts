'use client';

import { useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { User } from '@/types';
import { SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD } from '@/middleware/adminAuth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      // Demo mode - simulate auth
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
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!isSupabaseConfigured()) {
      // Demo mode
      const mockUser: User = {
        id: '1',
        email,
        full_name: fullName,
        skill_level: 'beginner',
        dietary_restrictions: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setUser(mockUser);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
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
          });

        if (profileError) {
        }
      }
    } catch (error: any) {
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      // Demo mode - handle admin login specially
      
      // Check if this is the admin login
      if (email === SUPER_ADMIN_EMAIL && password === SUPER_ADMIN_PASSWORD) {
        const adminUser: User = {
          id: 'admin-1',
          email: SUPER_ADMIN_EMAIL,
          full_name: 'Super Admin',
          skill_level: 'advanced',
          dietary_restrictions: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          role: 'super_admin',
          permissions: [
            'recipes:read',
            'recipes:write',
            'recipes:delete',
            'users:read',
            'users:write',
            'users:delete',
            'admin:full_access'
          ]
        };
        setUser(adminUser);
        return adminUser;
      }
      
      // Regular user login
      const mockUser: User = {
        id: '1',
        email,
        full_name: 'Demo User',
        skill_level: 'beginner',
        dietary_restrictions: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        role: 'user',
        permissions: ['profile:read', 'profile:write', 'recipes:read']
      };
      setUser(mockUser);
      return mockUser;
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
      // Demo mode
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
    if (!isSupabaseConfigured()) {
      // Demo mode
      if (user) {
        setUser({ ...user, ...updates });
      }
      return;
    }

    try {
      if (!user) throw new Error('No user logged in');

      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) throw error;

      setUser({ ...user, ...updates });
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