import { Pool } from 'pg';

// PostgreSQL connection pool
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

// Connection management
let isConnected = false;

pool.on('connect', () => {
  isConnected = true;
});

pool.on('error', (err) => {
  isConnected = false;
});

// Helper function to execute queries with logging and error handling
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // Only log in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('Executed query', {
        text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        duration,
        rows: res.rowCount
      });
    }
    
    return res;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Database query error:', error);
    }
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

// Get connection status
export const getConnectionStatus = async () => {
  if (!isPostgreSQLConfigured()) {
    return { connected: false, message: 'PostgreSQL not configured' };
  }
  
  try {
    await pool.query('SELECT 1');
    return { connected: true, message: 'Connected to PostgreSQL' };
  } catch (error) {
    return { connected: false, message: 'Failed to connect to PostgreSQL' };
  }
};

// Close pool (for graceful shutdown)
export const closePool = async () => {
  await pool.end();
};