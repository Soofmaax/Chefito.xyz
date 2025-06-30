import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if environment variables are properly configured (not placeholder values)
const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return !url.includes('your_supabase_url_here') && !url.includes('demo.supabase.co');
  } catch {
    return false;
  }
};

const isValidKey = (key: string | undefined): boolean => {
  return !!(key && key !== 'your_supabase_anon_key_here' && key !== 'demo-key' && key.length > 10);
};

const isConfigured = isValidUrl(supabaseUrl) && isValidKey(supabaseAnonKey);

if (!isConfigured) {
  console.warn('⚠️ Supabase environment variables not properly configured. Running in demo mode.');
}

// Use valid demo URL that won't cause URL construction errors
const demoUrl = 'https://demo.supabase.co';
const demoKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

export const supabase = createClient(
  isConfigured ? supabaseUrl! : demoUrl,
  isConfigured ? supabaseAnonKey! : demoKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  },
) as any;

// Server-side client for API routes (only for server-side usage)
export const createServerSupabaseClient = () => {
  if (typeof window !== 'undefined') {
    // Client-side: return regular client
    return supabase;
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!isConfigured || !serviceRoleKey || serviceRoleKey === 'your_service_role_key_here') {
    console.warn('⚠️ Server-side Supabase not configured. Using demo client.');
    return createClient(demoUrl, demoKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }) as any;
  }

  return createClient(supabaseUrl!, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }) as any;
};

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return isConfigured;
};
