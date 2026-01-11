// Vercel serverless function wrapper for Express app
const app = require('../server/server.js');
const { connectDB } = require('../server/config/database');

// Initialize database connection for serverless
let dbInitialized = false;

module.exports = async (req, res) => {
  try {
    if (!dbInitialized) {
      console.log('Initializing database connection...');
      await connectDB();
      dbInitialized = true;
      console.log('Database connected successfully');
    }
    return app(req, res);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};
