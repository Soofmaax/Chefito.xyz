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
  connectionTimeoutMillis: 10000, // Increased timeout for better reliability
});

// Test connection
pool.on('connect', () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('✅ Connected to PostgreSQL database');
  }
});

pool.on('error', (err: Error) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('❌ PostgreSQL connection error:', err);
  }
});

// Helper function to execute queries with better error handling
export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const start = Date.now();
    const res = await client.query(text, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Executed query', { text, duration, rows: res.rowCount });
    }
    
    return res;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Database query error:', error);
    }
    throw error;
  } finally {
    client.release();
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

// Graceful shutdown
process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await pool.end();
  process.exit(0);
});