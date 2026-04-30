import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

import { mockQuery } from './mockDb';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/fake',
});

// Suppress errors if we are just mocking
if (!process.env.DATABASE_URL) {
  console.log('⚠️ No DATABASE_URL found in .env. Falling back to IN-MEMORY MOCK DATA.');
} else {
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });
}

export const query = async (text: string, params?: any[]) => {
  if (!process.env.DATABASE_URL) {
    return mockQuery(text, params);
  }
  return pool.query(text, params);
};
