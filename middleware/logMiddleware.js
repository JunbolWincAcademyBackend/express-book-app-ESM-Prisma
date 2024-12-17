import logger from '../utils/log.js';

// Middleware to log requests


const log = (req, res, next) => {
  // Capture the start time of the request
  const start = new Date();

  // Call the next middleware or route handler
  next();

  // Calculate how long the request took to process
  const ms = new Date() - start;

  // Log the request method, URL, status code, and duration
  logger.info(`${req.method} ${req.originalUrl}. Status: ${res.statusCode}. Duration: ${ms} ms`);
};

// Export the middleware function for use in your app
export default log;


