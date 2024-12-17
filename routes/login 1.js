import { Router } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

// Resolving the path to the users.json file
const usersFilePath = path.resolve('data/users.json');

// Load the JSON file synchronously
const userData = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));

const router = Router(); // Naming the router instance 'router' in Express is a common convention because it is generic placeholder and can be reused across different files by adapting its original name to other name like loginRouter, etc. When you import and use this router in your main server file 'index.js', you typically give it a more descriptive name (like loginRouter) when necessary to avoid confusion. Should You Change It? There's no need to change the name to loginRouter inside login.js. You can keep router = Router(); in login.js and just give it a specific name when importing it in index.js (like loginRouter, categoriesRouter, userRouter, etc).

router.post('/', (req, res) => {//  '/': This represents the endpoint for the POST request. In this case, it's the root of the login route (/login), so '/' refers to /login.  req: This stands for request. In web development, req stands for request because the client (user or backend developer) is making a request to the server. This terminology reflects the fact that the client is asking the server to perform some action, like logging in, getting data, or submitting information.

// res: This stands for response. It's used to send a response back to the client (like a success message and the JWT token, or an error if login fails).
  const secretKey = process.env.AUTH_SECRET_KEY || 'my-secret-key'; // to create the secretKey we use .env which create an environment variable (which creates a random string) which comes from the runtime environment. But remember at the end I replace the AUTH_SECRET_KEY with the AUTH0_CLIENT_SECRET
  const { username, password } = req.body;
  const { users } = userData; // using object destructuring.
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials!' });
  }

// Generate a JWT token for the authenticated user
const token = jwt.sign(
  { userId: user.id },  // Payload: embed the user's ID in the token (user-specific data)
  /*When you create the token, the payload inside the JWT might look something like this:
{
  "userId": "12345"
} userId is the key name on the jwt JSON object  */

  secretKey    // Secret Key: used to sign the token and ensure its authenticity
);

  res.status(200).json({ message: 'Successfully logged in!', token });
});

export default router;


//NOTES on this logic:

/* Why Use post('/', (req, res) => {}) in Express:
The .post() method:

post() is one of the HTTP methods in Express (along with get(), put(), delete(), etc.).
It’s used to define a route that will handle POST requests. In this case, you're handling a POST request to the /login endpoint.
'/': This represents the endpoint for the POST request. In this case, it's the root of the login route (/login), so '/' refers to /login.
The Parameters (req, res):

req: This stands for request. It represents the incoming request data from the client (like the username and password in the req.body).

Why req (request) is Used:
In web development, req stands for request because the client (user or backend developer) is making a request to the server. This terminology reflects the fact that the client is asking the server to perform some action, like logging in, getting data, or submitting information.

In the case of logging in, the client is sending user credentials (username and password) in the request to ask the server to authenticate the user and return a result (like a JWT token).
The server processes this request and then sends back a response (res) based on the data it receives.
Understanding Request and Response:
Request (req): This represents the data sent to the server by the client. This can include:

Body: The data you're sending (like the username and password in a login form).
Headers: Extra information, like authentication tokens.
Params/Query: URL parameters or query strings that might modify the request.
In your login example, req.body contains the username and password the user is sending to the server as part of the request.

Response (res): This represents the server’s reply to the client. The server sends back data (like a success message and JWT token, or an error) based on the request it received.

Why It’s Called a Request:
Even though the client is providing data (username and password), it’s still a request because the client is requesting a service from the server. In the login example, the client is asking the server to authenticate them based on the credentials provided. The server is the one that fulfills the request by validating the credentials and responding accordingly.


res: This stands for response. It's used to send a response back to the client (like a success message and the JWT token, or an error if login fails).
The Arrow Function (req, res) => {}:

Arrow functions are simply a more concise way to write functions in JavaScript. They allow you to define the route handler in a cleaner way.
The function gets triggered whenever a POST request is made to the '/' route. It processes the request (e.g., checks the username and password) and sends a response.
Instead of writing the function like this:


router.post('/', function(req, res) {
  // your code here
});

You can use the arrow function for a shorter and more modern syntax:

router.post('/', (req, res) => {
  // your code here
}); 

// Generate a JWT token for the authenticated user
const token = jwt.sign(
  { userId: user.id },  // Payload: embed the user's ID in the token (user-specific data)
  secretKey             // Secret Key: used to sign the token and ensure its authenticity
);
Explanation:
jwt.sign(): This function is used to create a new JWT token. It takes two main arguments:
Payload ({ userId: user.id }): This is the data you want to store in the token. In this case, you’re including the user's ID (user.id) so that whenever the token is decoded later, you can know which user it belongs to.
Secret Key (secretKey): This is used to sign the token, making sure that the token can't be tampered with. Only the server (and anyone with the secret key) can verify and decode the token to get the original data.
The Purpose of the Token:
After a user logs in successfully, a JWT token is generated. This token allows the user to make authenticated requests to the server by sending the token in future requests (e.g., for creating, updating, or deleting events).
*/




