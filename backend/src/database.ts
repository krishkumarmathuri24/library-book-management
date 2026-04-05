import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

// PostgreSQL Pool for Supabase connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('supabase') ? { rejectUnauthorized: false } : false
});

/**
 * Utility to convert SQLite-style '?' placeholders to PostgreSQL-style '$1, $2'
 */
function convertSql(sql: string): string {
  let count = 1;
  return sql.replace(/\?/g, () => `$${count++}`);
}

export const run = async (sql: string, params: any[] = []): Promise<void> => {
  const converted = convertSql(sql);
  await pool.query(converted, params);
};

export const get = async <T>(sql: string, params: any[] = []): Promise<T | undefined> => {
  const converted = convertSql(sql);
  const { rows } = await pool.query(converted, params);
  return rows[0] as T;
};

export const all = async <T>(sql: string, params: any[] = []): Promise<T[]> => {
  const converted = convertSql(sql);
  const { rows } = await pool.query(converted, params);
  return rows as T[];
};

export const initDb = async () => {
  console.log('Using Supabase (PostgreSQL)');
  
  // Tables should be created using the provided supabase_setup.sql in the Supabase SQL Editor
  // but we can ensure they exist here too if needed.
  
  // Example of verifying connection
  try {
    await pool.query('SELECT NOW()');
    console.log('Connected to Supabase successfully');
  } catch (err) {
    console.error('Failed to connect to Supabase. Check your DATABASE_URL in .env');
    console.error(err);
  }
};
