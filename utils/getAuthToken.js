import axios from 'axios';

const getAuthToken = async (username, password) => {
  try {
    const response = await axios.post(
      `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      {
        grant_type: 'client_credentials',
        username,
        password,
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: process.env.AUTH0_AUDIENCE,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching Auth Token:', error.response?.data || error.message);
    throw new Error('Failed to get Auth Token');
  }
};

export default getAuthToken;

//In the getAuthToken.js code, the reason it returns a promise is that it uses the request-promise library. This library is built on top of the standard request library and automatically wraps the HTTP request in a promise.The request function from the request-promise library returns a promise. This means that when you call request(options), it does not return the actual response immediately. Instead, it returns a promise that will eventually be resolved with the response data once the HTTP request completes.The 'await' means that the function pauses execution until the promise returned by request(options) is resolved. Once the response has a value (options) then it will continue with the code below which put the 'response' into the variable access_token which in the routes will be add it as a token.

// NOTE on the reason why this file was created:

/* The Bouncer and the AuthMiddleware:
In this analogy, as you correctly pointed out:

The bouncer (your Express app) is responsible for checking the ID (the JWT token) of any person (user) who wants to enter the bar (access a protected route).
The bouncer uses authMiddleware to verify the ID (JWT). If the ID is valid, the user can come in (do things like POST, DELETE, etc.). If the ID is not valid, the bouncer refuses entry.
So, authMiddleware works perfectly to protect your routes and keep unauthorized people out.

What Role Does getAuthToken.js Play? 🤔
Now, let’s say that sometimes the bouncer needs to do more than just check IDs. Sometimes, the bouncer himself needs to perform a task, like contacting an external service (e.g., asking for a drink from another bar).

Here’s where getAuthToken.js comes in.

Imagine This Scenario:
Bookstore Bar is part of a group of bars, and the bouncer sometimes needs to go to another bar (let’s call it the "External API Bar") to grab something (maybe information about the best drinks).
In order to do this, the bouncer himself needs an ID to be recognized by the other bar.
getAuthToken.js is the process where the bouncer gets an ID for himself from the central bar system (Auth0). This ID (JWT) allows the bouncer to access the External API Bar and do his job (like retrieving information from another service).
So, in this expanded analogy:

The bouncer (your Express app) not only checks IDs of the visitors (users) to see if they are allowed in, but sometimes the bouncer needs to fetch his own ID (via getAuthToken.js) in order to make requests on behalf of the bar to other services (like calling the Bookstore API or another external service).
In Summary:
authMiddleware: The bouncer checks visitor IDs (tokens) to allow them into the Bookstore Bar (protect your routes).
getAuthToken.js: The bouncer gets his own ID (token) to visit another bar (API) and fetch something (like external information).
When Does the Bouncer Need His Own ID? 🎫
When the bouncer (your app) needs to interact with another bar (an external service or API), he needs an ID that will allow him to be recognized as a legitimate "visitor" at that other bar.
Example: Your Express app might need to call an external API (like Auth0 or another service) to get information or perform an action, and it needs an auth token for itself to do so.


Why Axios is Used in getAuthToken.js
In getAuthToken.js, Axios is used again to request a machine-to-machine access token. This is slightly different from login.js because it involves client credentials, not user credentials.

Here’s why:

Machine-to-Machine Authentication:

Your API (e.g., the bookstore prisma app) sometimes needs to perform secure actions that are not tied to a specific user but to the app itself. For example, calling another API, accessing a database, or performing backend actions.
In this case, the app authenticates itself using the client_id and client_secret provided by Auth0.

grant_type: 'password':

This is used in Resource Owner Password Grant, where a user provides their username and password directly to obtain a token.
This method is typically used in scenarios where you trust the client application, such as a first-party application.

In your case:
grant_type: 'password',
username,
password,
client_id: process.env.AUTH0_CLIENT_ID,
client_secret: process.env.AUTH0_CLIENT_SECRET,
audience: process.env.AUTH0_AUDIENCE,
Here:

Username and password are provided by the user (junierba@gmail.com and its password).
Auth0 validates the credentials and returns an access token (JWT).

You're using the Resource Owner Password Grant (grant_type: 'password') because you're validating a user's credentials (username and password) to issue a token for their API access.

If you were implementing machine-to-machine authentication (e.g., for server-to-server communication), you'd use grant_type: 'client_credentials' instead.

Would you like more clarification on when to use each grant type? 😊

Why Axios:

Same reasons as in login.js:
Clean handling of POST requests and headers.
Easy parsing of JSON responses.
Simplifies error handling for cases where Auth0 might return a failure response.
Example of its Usage in getAuthToken.js:
javascript
Copy code
const response = await axios.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
  grant_type: 'client_credentials',
  client_id: process.env.AUTH0_CLIENT_ID,
  client_secret: process.env.AUTH0_CLIENT_SECRET,
  audience: process.env.AUTH0_AUDIENCE,
});
Here, Axios is being used to securely get a token that the server (your app) can use for backend operations, like adding a new book or accessing protected resources.

*/
