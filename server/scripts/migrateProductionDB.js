require("dotenv").config();
const { Sequelize } = require("sequelize");

// Connect to production database
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: console.log,
});

async function runMigration() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to production database");

    // Add ai_message column if it doesn't exist
    await sequelize.query(`
      ALTER TABLE coupons 
      ADD COLUMN IF NOT EXISTS ai_message TEXT;
    `);

    console.log("✅ Migration completed: ai_message column added to coupons table");

    // Verify the column exists
    const [results] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'coupons' 
      AND column_name = 'ai_message';
    `);

    if (results.length > 0) {
      console.log("✅ Verification successful:", results[0]);
    } else {
      console.log("❌ Column not found after migration");
    }

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
