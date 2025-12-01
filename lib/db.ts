import { Pool, neonConfig } from '@neondatabase/serverless';

// Configure for serverless environments
if (typeof window === 'undefined') {
  neonConfig.fetchConnectionCache = true;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
