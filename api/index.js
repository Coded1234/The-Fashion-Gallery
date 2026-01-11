// Vercel Serverless Function
const app = require('../server/server.js');

module.exports = (req, res) => {
  // Strip /api prefix for Express routes
  req.url = req.url.replace(/^\/api/, '') || '/';
  return app(req, res);
};
