const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Vercel/Neon Postgres
  },
});

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log("Running migration to add google_id column...");
    
    // Check if column exists first
    const checkQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='users' AND column_name='google_id';
    `;
    
    const res = await client.query(checkQuery);
    
    if (res.rows.length === 0) {
      // Column doesn't exist, add it
      await client.query('ALTER TABLE users ADD COLUMN "google_id" VARCHAR(255) UNIQUE;');
      console.log("Successfully added google_id column to users table.");
    } else {
      console.log("google_id column already exists.");
    }
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();