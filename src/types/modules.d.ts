declare module 'next/server';
declare module 'next/link';
declare module 'next/navigation';
declare module 'lucide-react';
declare module '@supabase/supabase-js' {
  export interface Session {
    user: { id: string; [key: string]: any } | null;
  }
  export type AuthChangeEvent = 'SIGNED_IN' | 'SIGNED_OUT' | string;
  export function createClient(url: string, key: string, options?: any): any;
}
declare module 'purchases-js';
declare module 'pg';
declare module 'clsx' {
  export type ClassValue = any;
  export function clsx(...inputs: ClassValue[]): string;
}
declare module 'tailwind-merge' {
  export function twMerge(...inputs: any[]): string;
}
declare module 'next';
