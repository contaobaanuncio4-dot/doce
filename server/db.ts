import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Configure postgres connection with timeout settings
const connectionString = process.env.DATABASE_URL;

// Create postgres client with connection pooling and timeout configuration
const client = postgres(connectionString, {
  max: 10, // Maximum number of connections in pool
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 30, // Connection timeout in seconds
  prepare: false, // Disable prepared statements for better compatibility
  // Remove problematic types configuration for now
  onnotice: () => {}, // Suppress PostgreSQL notices
  debug: process.env.NODE_ENV === 'development', // Enable debug in development
});

// Initialize Drizzle with the postgres client
export const db = drizzle(client, { 
  schema,
  logger: process.env.NODE_ENV === 'development' 
});

// Graceful shutdown handler
process.on('SIGINT', async () => {
  console.log('Closing database connection...');
  await client.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Closing database connection...');
  await client.end();
  process.exit(0);
});

export default db;