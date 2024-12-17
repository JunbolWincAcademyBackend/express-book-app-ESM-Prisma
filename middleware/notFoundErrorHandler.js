const notFoundErrorHandler = (err, req, res, next) => {
    if (err.name === 'NotFoundError') {
      return res.status(404).json({ message: err.message })
    }
  
    next(err)
  }
  
  export default notFoundErrorHandler

//--- EXPLANATION:

/* This is an error-handling middleware specifically designed to catch and handle NotFoundError instances.
When an error of type NotFoundError is thrown, this middleware intercepts it, sets the appropriate HTTP status (e.g., 404), and sends a relevant error message back to the client.

Propagating Errors:
If an error occurs in a route handler or any middleware, you can pass it to the next error-handling middleware by calling next(err). Express will then automatically skip to the error-handling middleware that has err as the first parameter.

If the next(err) call was not included in the notFoundErrorHandler.js middleware, the system would not automatically proceed to the errorHandler.js or any other error-handling middleware. Here's why: 

How Express Middleware Works:
Express middleware functions are executed in the order they are defined in your application.
When an error occurs and is passed to an error-handling middleware (a middleware with four parameters: err, req, res, next), the middleware can either handle the error and send a response, or it can pass the error to the next middleware using next(err).
What Happens If next(err) Is Missing:
If next(err) is missing in the notFoundErrorHandler.js middleware:
The notFoundErrorHandler.js would handle the error (if it matches the condition) and send a response.
No further middleware would be called. The response would end there.
If the error does not match the NotFoundError condition and next(err) is not called, the middleware would not pass the error to the next middleware in the stack, effectively leaving the error unhandled for other cases.

The Importance of next(err):
Propagation of Errors: The next(err) call is crucial for allowing the error to propagate to the next middleware in line. If the error isn't of type NotFoundError, the next(err) ensures that the general errorHandler.js can still catch it and handle it appropriately.
Fallback Handling: If next(err) is not used, any errors that don’t match specific criteria in earlier error handlers won’t be passed along to more general error handlers. This could result in unhandled errors, potentially leading to silent failures or unresponsive behavior in your app.*/