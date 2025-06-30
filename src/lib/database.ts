import { Pool, PoolClient } from 'pg';

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
  console.error('❌ PostgreSQL connection error:', err.message);
  
  // Don't crash the application on connection errors
  // Instead, we'll handle errors at the query level
});

// Helper function to execute queries with better error handling
export async function query(text: string, params?: any[]) {
  let client: PoolClient | null = null;
  
  try {
    client = await pool.connect();
    const start = Date.now();
    const res = await client.query(text, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Executed query', { text, duration, rows: res.rowCount });
    }
    
    return res;
  } catch (error: any) {
    // Enhance error with query information for better debugging
    const enhancedError = new Error(`Database query error: ${error.message}`);
    enhancedError.cause = error;
    
    // In development, log the error
    if (process.env.NODE_ENV !== 'production') {
      console.error('Database query error:', {
        error: error.message,
        query: text,
        params
      });
    }
    
    throw enhancedError;
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Check if PostgreSQL is configured
export const isPostgreSQLConfigured = () => {
  const requiredVars = [
    process.env.DATABASE_URL || 
    (process.env.POSTGRES_HOST && 
     process.env.POSTGRES_DB && 
     process.env.POSTGRES_USER && 
     process.env.POSTGRES_PASSWORD)
  ];
  
  return !!requiredVars[0];
};

// Get a direct client for transactions
export async function getClient() {
  return await pool.connect();
}

// Close the pool (useful for tests and scripts)
export async function closePool() {
  await pool.end();
}

// Create a mock database for testing
export function createMockDatabase() {
  return {
    query: async (text: string, params?: any[]) => {
      console.log('Mock query:', { text, params });
      return { rows: [], rowCount: 0 };
    },
    getClient: async () => {
      return {
        query: async (text: string, params?: any[]) => {
          console.log('Mock client query:', { text, params });
          return { rows: [], rowCount: 0 };
        },
        release: () => {}
      };
    },
    closePool: async () => {}
  };
}