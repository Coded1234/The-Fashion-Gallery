// Vercel serverless function wrapper for Express app
const app = require('../server/server.js');
const { connectDB } = require('../server/config/database');

// Initialize database connection for serverless
let dbInitialized = false;

module.exports = async (req, res) => {
  if (!dbInitialized) {
    await connectDB();
    dbInitialized = true;
  }
  return app(req, res);
};
