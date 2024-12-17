import { Router } from 'express';
import jwt from 'jsonwebtoken';
import userData from '../data/users.json' assert { type: "json" }; // Use ESM to import the users.json file

const router = Router(); // Naming the router instance 'router' in Express is a common convention because it is generic placeholder and can be reused across different files by adapting its original name to other name like loginRouter, etc. When you import and use this router in your main server file 'index.js', you typically give it a more descriptive name (like loginRouter) when necessary to avoid confusion. Should You Change It? There's no need to change the name to loginRouter inside login.js. You can keep router = Router(); in login.js and just give it a specific name when importing it in index.js (like loginRouter, categoriesRouter, userRouter, etc).

// POST route to handle login
router.post('/', (req, res) => {//  '/': This represents the endpoint for the POST request. In this case, it's the root of the login route (/login), so '/' refers to /login.  req: This stands for request. In web development, req stands for request because the client (user or backend developer) is making a request to the server. This terminology reflects the fact that the client is asking the server to perform some action, like logging in, getting data, or submitting information.

  // res: This stands for response. It's used to send a response back to the client (like a success message and the JWT token, or an error if login fails).But remember at the end I replace the AUTH_SECRET_KEY with the AUTH0_CLIENT_SECRET
  const secretKey = process.env.AUTH_SECRET_KEY || 'my-secret-key'; // Use AUTH_SECRET_KEY for local JWT signing
  const { username, password } = req.body;
  const { users } = userData;

  // Find user in the local JSON file
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials!' });
  }

  // Generate a JWT token for the authenticated user
  const token = jwt.sign({ userId: user.id }, secretKey);

  res.status(200).json({ message: 'Successfully logged in!', token });
});

export default router;
