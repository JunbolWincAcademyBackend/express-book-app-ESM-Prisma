import { Router } from 'express';
import axios from 'axios'; // We'll use axios to communicate with Auth0

const router = Router();

// POST route for login using Auth0
router.post('/', async (req, res) => {
  const { username, password } = req.body;
  console.log('Username:', username); // ✅ Debug log
  console.log('Password:', password); // ✅ Debug log

  // Auth0 credentials from .env
  const clientId = process.env.AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;
  const authDomain = process.env.AUTH0_DOMAIN; // Auth0 domain from .env
  const audience = process.env.AUTH0_AUDIENCE;

  try {
    // Make a request to Auth0 to get an access token
    const response = await axios.post(`https://${authDomain}/oauth/token`, {
      grant_type: 'password',
      username: username,
      password: password,
      client_id: clientId,
      client_secret: clientSecret,
      audience: audience,
    });
    console.log({
      grant_type: 'password',
      username: req.body.username,
      password: req.body.password,
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: process.env.AUTH0_AUDIENCE,
    });

    // Debugging Environment Variables
    console.log({
      clientId,
      clientSecret,
      authDomain,
      audience,
    });

    console.log('Auth0 Response:', response.data); // ✅ Debug log
    // Extract the access token from the Auth0 response
    const { access_token } = response.data;

    // Return the token to the client
    res.status(200).json({ message: 'Successfully logged in!', token: access_token });
  } catch (error) {
    console.error('Error during authentication', error);
    return res.status(401).json({ message: 'Invalid credentials or login error!' });
  }
});

export default router;

// NOTES ON AXIOS:

/* Axios is a promise-based HTTP client for JavaScript. It is used to make HTTP requests to servers, much like fetch but with additional features that make it easier to use, such as:

Promise-based: Axios is built around promises, making it simple to handle asynchronous operations.

Automatic JSON Handling: It automatically parses JSON responses, so you don’t have to call .json() manually.

Headers and Config: It provides an easy way to set request headers or configuration options (like timeouts).
Interceptors: Allows you to modify requests or responses before they’re sent or handled (e.g., add authentication tokens).
Error Handling: It simplifies error handling by automatically rejecting promises for HTTP error statuses.

Why Axios is Used in login.js
In login.js, Axios is used to communicate with the Auth0 authentication server (/oauth/token) to request a token. Here's why Axios is helpful in this case:

Making a POST Request:

To authenticate the user, the app needs to send their username and password to the Auth0 server via a POST request.
Axios makes this process straightforward by allowing you to define the request body and headers in a clean, readable way.

Custom Headers:
The /oauth/token endpoint requires specific headers like Content-Type: application/json. Axios makes it easy to configure these headers.

Handle Responses:
The server responds with an access token, which you extract using Axios’s response object (e.g., response.data.access_token).

Example of its Usage in login.js:

const response = await axios.post(`https://${authDomain}/oauth/token`, {
  grant_type: 'password',
  username: username,
  password: password,
  client_id: clientId,
  client_secret: clientSecret,
  audience: audience,
});
Here, Axios is used to handle the interaction between your application and the Auth0 authentication server. It helps send the user credentials to Auth0 and retrieve the access token needed for authentication.

if you wouldnt use Axios then you would need to write the native fetch API code or use Node.js https Module:

Native fetch code:
const fetch = require('node-fetch'); // If using Node <18, install via npm: npm install node-fetch

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'password',
        username: username,
        password: password,
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: process.env.AUTH0_AUDIENCE,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error_description || 'Error during authentication');
    }

    // Return the token
    res.status(200).json({ message: 'Successfully logged in!', token: data.access_token });
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(401).json({ message: 'Invalid credentials or login error!' });
  }
});


Node.js https Module:This is more complex and verbose:
const https = require('https');

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  const options = {
    hostname: process.env.AUTH0_DOMAIN,
    port: 443,
    path: '/oauth/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const requestData = JSON.stringify({
    grant_type: 'password',
    username: username,
    password: password,
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
    audience: process.env.AUTH0_AUDIENCE,
  });

  const request = https.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      const responseData = JSON.parse(data);

      if (response.statusCode === 200) {
        res.status(200).json({ message: 'Successfully logged in!', token: responseData.access_token });
      } else {
        res.status(401).json({ message: responseData.error_description || 'Invalid credentials or login error!' });
      }
    });
  });

  request.on('error', (error) => {
    console.error('Error during authentication:', error);
    res.status(401).json({ message: 'Error during authentication.' });
  });

  request.write(requestData);
  request.end();
});


*/