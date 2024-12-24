import 'dotenv/config'; // Load environment variables
import express from 'express';
import * as Sentry from '@sentry/node'; // Import Sentry for error tracking
import * as Tracing from '@sentry/tracing'; // Import Tracing for performance monitoring
import booksRouter from './routes/books.js'; // Book routes
import recordsRouter from './routes/records.js'; // Records routes
import log from './middleware/logMiddleware.js'; // Logging middleware
import loginRouter from './routes/login.js'; // Login routes
import errorHandler from './middleware/errorHandler.js'; // Custom error handler
import userRouter from './routes/users.js'; // Add this line here (//2)

const app = express(); // Create an Express instance
const port = process.env.PORT || 3000; // Use port from .env or default to 3000

//---------------------------
// Sentry Initialization
//---------------------------
// Sentry initialization
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Tracing.Integrations.Express({ app }), // Express integration
  ],
  tracesSampleRate: 1.0,
});


//---------------------------
// Sentry Middleware
//---------------------------
/* Attach Sentry's requestHandler middleware to capture incoming requests */
app.use(Sentry.Handlers.requestHandler()); // ✅ Correctly placed request handler

/* Attach Sentry's tracingHandler middleware for performance monitoring */
app.use(Sentry.Handlers.tracingHandler()); // ✅ Correctly placed tracing handler

console.log('SENTRY_DSN:', process.env.SENTRY_DSN);

//---------------------------
// Standard Middleware
//---------------------------
app.use(express.json()); // Parses incoming JSON payloads
app.use(log); // Custom middleware for logging

//---------------------------
// Routes
//---------------------------
/* Define the routes for your app. */
app.use('/login', loginRouter); // Public route

// Debugging for Books Route

app.use(
  '/books',
  (req, res, next) => {
    console.log('Books route hit'); // ✅ Debug log
    next();
  },
  booksRouter
); // Books route

app.use('/records', recordsRouter); // Records route

// Root route for testing basic connectivity
app.get('/', (req, res) => {
  res.send('Hello World now!'); // Basic test route
});

// Use the userRouter (see //3 below)
app.use('/users', userRouter);

//---------------------------
// Error Handling Middleware
//---------------------------
/* Attach Sentry's error handler to capture unhandled exceptions */
app.use(Sentry.Handlers.errorHandler()); // ✅ Correct placement for Sentry's error handler

/* Custom Error Handler */
app.use(errorHandler);

/* How Do Both Error Handlers Work Together?
Sentry’s errorHandler() captures and logs the error to Sentry.
Your custom errorHandler.js sends a response to the client.
*/

//---------------------------
// Start the Server
//---------------------------
/* app.listen() starts the server and listens for incoming requests on the specified port. */
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// NOTES on Sentry use of errorHandlers:
/* 1. Sentry's RequestHandler vs. Your Custom Request Handling
Sentry’s requestHandler():

Sentry’s requestHandler() is a built-in middleware provided by Sentry to capture and monitor incoming requests. It automatically tracks incoming HTTP requests, attaches metadata (such as request details), and sets up performance tracing if enabled. It’s part of Sentry’s built-in request tracking system and doesn’t require custom configuration.

You don’t need to create a custom request handler for logging incoming requests because Sentry provides this out of the box. When you call app.use(Sentry.Handlers.requestHandler());, Sentry takes over to monitor requests and send data back to the Sentry platform.

2. Your Custom errorHandler.js vs. Sentry’s Error Handler
You have two different error handlers here:

Sentry’s errorHandler():

This is Sentry’s built-in middleware for catching and reporting errors. Sentry's errorHandler() automatically captures any errors that occur during request processing and sends them to Sentry.
This is added to your application via app.use(Sentry.Handlers.errorHandler());. It's responsible for sending unhandled errors to Sentry for logging and tracking.
Your Custom errorHandler.js:

This is the custom middleware you wrote to handle errors in your app. It ensures that if an error occurs, you can send a meaningful response back to the client (usually with a 500 status and an error message like "Something went wrong!").
Your custom errorHandler.js complements Sentry’s error handler by providing a user-friendly error message while also potentially logging errors locally.
*/
