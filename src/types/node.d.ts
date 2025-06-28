// Type definitions for Node.js process
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
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
    NEXTAUTH_SECRET: string;
    NEXTAUTH_URL: string;
    OLLAMA_ENDPOINT: string;
    OLLAMA_MODEL: string;
    CONTACT_EMAIL: string;
    TELEGRAM_BOT: string;
  }

  interface Timeout {}
}

export {};