
/* Why is errorHandler.js in the Middleware Folder?
Error handling middleware like errorHandler.js is part of the middleware pipeline in Express. Middleware in Express is code that runs between receiving the request and sending the response.
Since errorHandler.js is middleware that catches general errors and sends a response (like a 500 Internal Server Error), it belongs in the middleware folder because it works like other middleware (e.g., logging, parsing JSON). */


const errorHandler = (err, req, res, next) => { /*This err is the error object that was thrown or passed to the next function earlier in the middleware chain. It contains information about what went wrong, such as an error message or stack trace.The presence of the err parameter tells Express that this is an error-handling middleware.
This is a general error handler for your application. It catches any errors that are not specifically handled by other middleware (like notFoundErrorHandler.js).
It logs the error and sends a generic "Something went wrong!" message to the client, typically with a 500 status code for server errors.*/
  
    console.error(err)
    res.status(500).json({ message: 'Something went wrong!' })
  }
  
export default errorHandler;

/* Note on why err is first:

Express Convention:
Express has a specific convention for error-handling middleware. It must have four parameters: err, req, res, and next. This special signature (with err as the first argument) tells Express that this function is an error-handling middleware.

Error Detection:
By placing err first, Express knows that this middleware is designed to handle errors. When an error occurs during the processing of a request, Express will skip all other middleware and route handlers and directly pass the error to the first error-handling middleware it finds, which is the same errorHandler middleware the 'err' parameter object is been used,

Consistent Flow:
Normal Middleware: req, res, next
Error-Handling Middleware: err, req, res, next
This consistent flow allows Express to differentiate between middleware that handles requests normally and middleware designed specifically to handle errors.

Propagating Errors:
If an error occurs in a route handler or any middleware, you can pass it to the next error-handling middleware by calling next(err). Express will then automatically skip to the error-handling middleware that has err as the first parameter.

//-----Why All Three?
Specificity: The NotFoundError.js and notFoundErrorHandler.js are specifically designed to handle "not found" scenarios. This ensures that these cases are handled in a clear and consistent way, with a specific HTTP status (404) and message.

Separation of Concerns: By separating the logic for handling different types of errors (like not found vs. general server errors), your code becomes more maintainable, easier to debug, and more scalable.

Error Propagation: If an error occurs that is not a "not found" error, it will bypass the notFoundErrorHandler.js and move to the next middleware, which is typically your errorHandler.js (or Sentry's handler). This way, each type of error is handled by the most appropriate piece of middleware. */

