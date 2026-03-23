const winston = require("winston");

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
    ),
  }),
];

// Vercel and other serverless environments have read-only file systems (except /tmp).
// We should only write to local files if we are NOT running on Vercel.
if (!process.env.VERCEL) {
  transports.push(
    new winston.transports.File({ filename: "logs/error.log", level: "error" })
  );
  transports.push(
    new winston.transports.File({ filename: "logs/application.log" })
  );
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports,
});

module.exports = logger;
