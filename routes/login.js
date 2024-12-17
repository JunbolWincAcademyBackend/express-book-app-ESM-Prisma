import { Router } from 'express';
import axios from 'axios'; // We'll use axios to communicate with Auth0

const router = Router();

// POST route for login using Auth0
router.post('/', async (req, res) => {
  const { username, password } = req.body;

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
      audience: audience 

    });

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
