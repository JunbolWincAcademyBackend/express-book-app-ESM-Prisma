import express from 'express';
import booksRouter from './routes/books.js'; // 🚩❗❗Attention! while I called the instance of the router: "router" I am importing it like "booksRouter" you can call it anything you want
import recordsRouter from './routes/records.js';
import log from './middleware/logMiddleware.js';
import loginRouter from './routes/login.js'; //here we gave a more descriptive name to 'router' now is called 'loginRoute' instead
import 'dotenv/config';
import errorHandler from './middleware/errorHandler.js';
import * as Sentry from '@sentry/node';

const app = express(); //Creates an instance of Express (app) Think of the app object in Express as the central hub of our application. It's like the manager of a restaurant, keeping track of everything that goes on. It's where we set up all our routes and middleware (don't worry, we'll talk more about what these are soon!). You can name this object whatever you want, but most people stick with app - it's a bit of a tradition in Express.

/*
//adding Sentry OLD VERSION THAT DIDNT WORK:
Sentry.init({
  dsn: 'https://1fba99c60b3f472f1441d8ad64eea480@o4507764486504448.ingest.de.sentry.io/4507764640448592',
  
  integrations: [
    // enable HTTP calls tracing
    //new Sentry.Integrations.Http({ tracing: true }),// 🐞🚩 this was causing issues so Socrates says to comment it out: "you can safely remove or comment it out. The primary purpose of the Http integration is to trace outgoing HTTP requests, but your application can function without it, especially during development."
    // enable Express.js middleware tracing
    //new Sentry.Integrations.Express({ app }),
    // Automatically instrument Node.js libraries and frameworks
    //...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// Check if Sentry handlers are defined before using them
if (Sentry.Handlers && Sentry.Handlers.requestHandler) {
  app.use(Sentry.Handlers.requestHandler());
}

// Uncomment this if you want to enable tracing and it is working correctly
// if (Sentry.Handlers && Sentry.Handlers.tracingHandler) {
//   app.use(Sentry.Handlers.tracingHandler());
// }

////////////////////////////////
*/

//adding Sentry NEW VERSION:
// Basic Sentry initialization
Sentry.init({
  dsn: 'https://1fba99c60b3f472f1441d8ad64eea480@o4507764486504448.ingest.de.sentry.io/4507764640448592',
  debug: true, // Enables detailed logging to the console
  tracesSampleRate: 1.0,
  environment: 'development',
});

// Attach the request handler for Sentry (if available)
if (typeof Sentry.Handlers?.requestHandler === 'function') {
  app.use(Sentry.Handlers.requestHandler());
}

////////////////////////////////

app.use(express.json());

app.use(log); //This  attaches the logging middleware globally to the app, meaning that every incoming request will be processed by this middleware.

app.use('/login', loginRouter); // This makes the router 'loginRouter' accessible at '/login'

app.use('/books', booksRouter); //tells Express to attach all the routes from the previous module to the server, to the “/books” route - this ensures that inside the books router, we can use relative URL paths (e.g. instead of “/books/:id”, we just used “/:id”).

app.use('/records', recordsRouter); //tells Express to attach all the routes from the previous module to the server, to the “/books” route - this ensures that inside the books router, we can use relative URL paths (e.g. instead of “/records/:id”, we just used “/:id”).

app.get('/', (req, res) => {
  //Creates a root route '/' returning some text. This is us creating a 'root route' that sends back a message when someone visits the homepage of our app. Think of it as a welcome mat for our digital house.
  res.send('Hello World now!');
});

// The error handler must be ❓ before any other error middleware ????? and ❓after all controllers ??? which controllers? ah the routes.
// this version didn't work:
//app.use(Sentry.Handlers.errorHandler()); // this didn't work so Socrates gave me another solution code:

// correct version:// Attach the Sentry Error Handler middleware for Sentry (if available) - Must be before any other error handling middleware
if (typeof Sentry.Handlers?.errorHandler === 'function') {
  app.use(Sentry.Handlers.errorHandler()); //It captures errors that occur during request processing and forwards them to Sentry. It also ensures that Sentry can log relevant data about incoming requests. This is the primary Sentry middleware responsible for catching any errors that occur during request handling, including those that were not caught by the request handler. It is added before any custom error handlers you define (like errorHandler.js).
}
//After the Sentry error handler, you attach your own errorHandler.js middleware: errorHandler. This is a general error handler that catches any remaining errors, logging them or sending a response to the client. It's your final line of defense for error handling in your Express app.
// Attach your custom error handler middleware after Sentry's error handler
app.use(errorHandler);

//The reason for having also the notFoundErrorHandler.js and NotFoundError.js in addition to your general errorHandler.js is to provide specific error handling for particular situations, like when a resource (e.g., a book or record) is not found.

app.listen(3000, () => {
  //Starts the server. Lastly, we have the server starting up with app.listen(). This is like opening the doors of our restaurant to let customers in. We're telling our app to start listening for requests on a certain port (we've picked port 3000). So, you'll be able to see your app running by visiting http://localhost:3000 on your browser (or the same port of whatever environment we're running it in). You'll also see a message in your console confirming that your server is up and running!
  console.log('Server is listening on port 3000');
});

//---- OLD FUNCTION VERSION-----------
/* app.get('/', (req, res) => {
  //Creates a root route '/' returning some text. This is us creating a 'root route' that sends back a message when someone visits the homepage of our app. Think of it as a welcome mat for our digital house.
  res.send('Hello World now!');
}); */
