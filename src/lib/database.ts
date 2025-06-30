import { Pool } from 'pg';

// PostgreSQL connection for recipes
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.on('connect', () => {
});

pool.on('error', (err: Error) => {
});

export { pool };

// Helper function to execute queries
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    return res;
  } catch (error) {
    throw error;
  }
}

// Check if PostgreSQL is configured
export const isPostgreSQLConfigured = () => {
  return !!(
    process.env.DATABASE_URL || 
    (process.env.POSTGRES_HOST && 
     process.env.POSTGRES_DB && 
     process.env.POSTGRES_USER && 
     process.env.POSTGRES_PASSWORD)
  );
};