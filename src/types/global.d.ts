// Types globaux pour éviter les erreurs TypeScript
declare global {
  interface Window {
    speechSynthesis: SpeechSynthesis;
  }
}

// Types pour les modules sans déclarations
declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

// Types pour les variables d'environnement
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    DATABASE_URL: string;
    POSTGRES_HOST: string;
    POSTGRES_PORT: string;
    POSTGRES_DB: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    ELEVENLABS_API_KEY: string;
    NEXT_PUBLIC_REVENUECAT_API_KEY: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}

export {};