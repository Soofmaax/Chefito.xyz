// This file has been disabled for production
// To re-enable for development, uncomment the code below

/*
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const seedData = async () => {
  try {
    // Seed code removed for production
    console.log('⚠️ Seeding disabled in production');
  } catch (error) {
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// seedData();
*/