import jwt from 'jsonwebtoken';


const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // Split the authorization header to get the token part
  const token = authHeader.split(' ')[1]; // the split(' ') split the token in two parts if there is a space in between, then puts a comma. It finished with an array. The [1] select the second array item ["Bearer", "<token>"]
  //the token is taken from token generated in the authorization tab in the PUT request in Postman.
  const secretKey = process.env.AUTH_SECRET_KEY || 'my-secret-key';

  if (!token) {
    return res.status(401).json({ message: 'You cannot access this operation without a token!' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {//jwt.verify(token, secretKey) is the key part where the token received in the request header is verified using the secret key.
    if (err) {
      return res.status(403).json({ message: 'Invalid token provided!' });
    }

    req.user = decoded;
    next();
  });
};

export default authMiddleware;

