const { Client } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const runMigration = async () => {
  const client = new Client({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await client.connect();
    console.log("Connected to database");

    // Read the SQL file
    const sqlPath = path.join(__dirname, "addEmailVerification.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    // Execute the migration
    console.log("Running email verification migration...");
    await client.query(sql);

    console.log("✅ Email verification fields added successfully!");
    console.log(
      "Note: Existing users have been automatically verified. New users will need to verify their email.",
    );
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
};

runMigration();
