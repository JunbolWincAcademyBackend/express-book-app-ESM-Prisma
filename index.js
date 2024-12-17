import express from 'express';
import booksRouter from './routes/books.js'; // Book routes
import recordsRouter from './routes/records.js'; // Records routes
import log from './middleware/logMiddleware.js'; // Logging middleware
import loginRouter from './routes/login.js'; // Login routes
import 'dotenv/config'; // Loads environment variables from .env file
import errorHandler from './middleware/errorHandler.js'; // Custom error handler
import * as Sentry from '@sentry/node'; // Sentry for error tracking

const app = express(); // Creates an instance of Express
const port = process.env.PORT || 3000; // Use port from .env or default to 3000

//---------------------------
// Sentry Initialization
//---------------------------
/* Sentry.init() is used to initialize the Sentry SDK. 
The DSN (Data Source Name) connects your app to your Sentry project, so it knows where to send error data. 
You can configure other settings, like sample rate, environment, etc.

Sentry is designed to handle error tracking in both development and production environments.
In production, it sends errors to Sentry’s dashboard.
In development, setting debug: true allows detailed logs about Sentry’s operation to be printed to the console, which can help you see how Sentry is working (e.g., whether it’s capturing and sending errors correctly).

*/

Sentry.init({
  dsn: process.env.SENTRY_DSN , // DSN from your Sentry project in .env
  debug: true, // Logs detailed info to the console in development (optional)
  tracesSampleRate: 1.0, // Capture 100% of transactions for performance monitoring
  environment: process.env.NODE_ENV || 'development', // Set environment from .env or fallback to 'development' etc.)
});

console.log('SENTRY_DSN:', process.env.SENTRY_DSN);


// Attach the Sentry request handler middleware
/* This middleware automatically captures and reports all incoming HTTP requests to Sentry. 
   It ensures that Sentry starts tracking the request as soon as it hits the server. */

/*    Modify your index.js to ensure that requestHandler() is available before using it. This way, the app won’t crash if it's missing: */
   if (Sentry.Handlers?.requestHandler) {
    app.use(Sentry.Handlers.requestHandler());
  }
  //requestHandler() is a built-in middleware that automatically tracks incoming requests. It creates a trace for each incoming request and keeps track of key request-related information like headers, route paths, etc.

//---------------------------
// Standard Middleware
//---------------------------

app.use(express.json()); // Parses incoming JSON payloads
app.use(log); // Custom made logging middleware (logs details like method, URL, status, etc.)

//---------------------------
// Routes
//---------------------------
/* Define the routes for your app, like /login, /books, and /records. 
   Each route has its own router file that handles specific logic. */
app.use('/login', loginRouter); // Public route (login doesn’t require JWT)
app.use('/books', booksRouter); // Protected route for book-related operations
app.use('/records', recordsRouter); // Protected route for record-related operations

// Root route for testing basic connectivity
app.get('/', (req, res) => {
  res.send('Hello World now!'); // Basic test route for root '/'
});

//---------------------------
// Error Handling Middleware
//---------------------------

/* Sentry's errorHandler middleware: 
   This middleware should be attached after all the routes. 
   It automatically captures any unhandled exceptions and forwards them to Sentry. This checks if Sentry’s error handler exists (typeof Sentry.Handlers?.errorHandler === 'function') and, if it does, uses it with app.use(Sentry.Handlers.errorHandler());.
This is not referring to your custom errorHandler.js. This is only for Sentry’s built-in errorHandler to catch unhandled errors and report them to Sentry. */
if (typeof Sentry.Handlers?.errorHandler === 'function') {
  app.use(Sentry.Handlers.errorHandler());
}

/* Custom Error Handler (errorHandler.js):
   After Sentry's error handler, we use our own custom error handler to send a response to the client. 
   This middleware catches any remaining unhandled errors that weren’t processed by previous middlewares. */
app.use(errorHandler);

/* How Do Both Error Handlers Work Together?
Here’s how Sentry’s and your custom error handlers work together:

Sentry’s errorHandler() captures and logs the error to Sentry.
After Sentry captures the error, it passes control to your custom errorHandler.js middleware.
Your custom errorHandler.js sends a response back to the client with a meaningful message, like "Something went wrong!", and optionally logs the error locally. */

//---------------------------
// Start the Server
//---------------------------
/* app.listen() starts the server and listens for incoming requests on the specified port. */
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
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
3. This Code Block:
javascript
Copy code
if (typeof Sentry.Handlers?.errorHandler === 'function') {
  app.use(Sentry.Handlers.errorHandler());
}
What does this do?
This checks if Sentry’s error handler exists (typeof Sentry.Handlers?.errorHandler === 'function') and, if it does, uses it with app.use(Sentry.Handlers.errorHandler());.
This is not referring to your custom errorHandler.js. This is only for Sentry’s built-in errorHandler to catch unhandled errors and report them to Sentry.
4. How Do Both Error Handlers Work Together?
Here’s how Sentry’s and your custom error handlers work together:

Sentry’s errorHandler() captures and logs the error to Sentry.
After Sentry captures the error, it passes control to your custom errorHandler.js middleware.
Your custom errorHandler.js sends a response back to the client with a meaningful message, like "Something went wrong!", and optionally logs the error locally.
Flow Example:
An error occurs in your application (e.g., in a route or middleware).
Sentry’s errorHandler() catches the error first and logs it to the Sentry dashboard.
Your custom errorHandler.js runs next and sends a 500 response to the client with a user-friendly message. */

