import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/postgres',
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const initDb = async () => {
  // Enable pgcrypto for gen_random_uuid() if not already available
  await query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  await query(`
    CREATE TABLE IF NOT EXISTS products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT UNIQUE NOT NULL,
      category TEXT,
      overall_real_score FLOAT,
      hype_score FLOAT,
      reality_score FLOAT,
      last_updated TIMESTAMP DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS red_flags (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      product_id UUID REFERENCES products(id),
      issue_summary TEXT NOT NULL,
      frequency_count INT DEFAULT 1,
      severity TEXT -- 'low', 'medium', 'high'
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS cached_reviews (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      product_id UUID REFERENCES products(id),
      source_url TEXT,
      content_snippet TEXT,
      sentiment_score FLOAT
    );
  `);
  
  console.log('Database initialized');
};
