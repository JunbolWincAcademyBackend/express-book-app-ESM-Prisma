// Import node-fetch dynamically (for ES Module support)
async function getAuthToken() {
    const fetch = (await import('node-fetch')).default;

    try {
        // Make the POST request to Auth0 to get the access token
        const response = await fetch('https://dev-7txjr4h7f68rlivl.us.auth0.com/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: process.env.AUTH0_CLIENT_ID || 'Op70SJ5Iz3LK6f0wu1vfuqkcL9Fa6fyk',
                client_secret: process.env.AUTH0_CLIENT_SECRET || '7EhHrqMukJIlHhg_ksnaOsu6u2dOSyVptAiOCbmU8yuCY6iH5SDguSw1IBABWhGo',
                audience: 'https://book-store-api',
                grant_type: 'client_credentials'
            })
        });

        // Parse the response to JSON
        const data = await response.json();
        console.log('Auth0 Token Response:', data); // ✅ Log the full Auth0 token response

        // Return the access token
        return data.access_token;

    } catch (error) {
        // Handle any errors (e.g., network errors, invalid credentials)
        console.error('Error fetching the access token:', error);
        throw new Error('Failed to fetch access token');
    }
}

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
Example: Your Express app might need to call an external API (like Auth0 or another service) to get information or perform an action, and it needs an auth token for itself to do so. */


