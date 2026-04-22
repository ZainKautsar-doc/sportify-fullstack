import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

/**
 * Database connection pool.
 * Uses connectionString (DATABASE_URL) if available, 
 * falling back to individual parameters for local development.
 */
export const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false, // Required for Railway/Render/AWS RDS
        },
      }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
      }
);