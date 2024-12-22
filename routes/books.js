import express from 'express';
import getBooks from '../services/books/getBooks.js'; // Corrected path
import getBookById from '../services/books/getBookById.js'; // Corrected path
import createBook from '../services/books/createBook.js'; // Corrected path
import updateBookById from '../services/books/updateBookById.js'; // Corrected path
import deleteBook from '../services/books/deleteBook.js'; // Corrected path
import authMiddleware from '../middleware/advancedAuth.js'; // Corrected path
import getAuthToken from '../utils/getAuthToken.js'; // Corrected path
import NotFoundError from '../errors/NotFoundError.js'; // Corrected path

const booksRouter = express.Router();

// Route to get all books


booksRouter.get('/', (req, res, next) => {
  try {
    console.log('Fetching books...'); // ✅ Log request
    const { genre, available } = req.query; // Extract query parameters
    const books = getBooks(genre, available); // Call getBooks with filters
    res.status(200).json(books); // Send books as JSON response
  } catch (error) {
    console.error('Error fetching books:', error); // Log error
    next(error); // Pass error to middleware
  }
});

// Route to get a book by ID
booksRouter.get('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const book = getBookById(id);

    if (!book) {
      throw new NotFoundError('Book', id);
    }

    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
});

// Route to create a new book
// The authMiddleware ensures that only authorized users can access this route by validating the provided JWT token.
/*
    HOW TO USE THIS ROUTE WITH POSTMAN:
    1. Log in to Auth0:
       - Use the POST /login route to log in with your username (email) and password from Auth0.
       - Example body for Postman:
         {
           "username": "johndoe@example.com",
           "password": "SuperSecurePassword!"
         }
       - If successful, you'll receive a token in the response.You need to copy that token key somewhere because 
       The access token is then sent in the Authorization header of each request to your API 

       Here’s how it works:

      1. Auth0 API User Credentials. For each API you need create an new API in the Auth0 platform and for each API you need to create a user LOG INS  for that API which are different than the logins to enter Auth0.
      Username: Typically, this is the email address of the user registered in Auth0.
      Password: The password the user set up during registration or was provided when the account was created in the Auth0 dashboard.Auth0 will send a verification email to that user email to verify it.

      2. Connection: Select Username-Password-Authentication.


      3. Why Use These Credentials?
      then I need to add all the necessary info the .env requires:
      remember the CLIENT ID is in Applications

AUTH0_CLIENT_ID=<Your Auth0 Application's Client ID>
AUTH0_CLIENT_SECRET=<Your Auth0 Application's Client Secret>
AUTH0_DOMAIN=<Your Auth0 Domain, e.g., dev-xxxx.us.auth0.com>
AUTH0_AUDIENCE=https://book-store-api




Great question! Let’s clarify how the new user is related to your API and whether you need to use these credentials for all your APIs.

How the New User Is Related to the API
Users and APIs:

When you create a user in Auth0, they can authenticate against the APIs you define in Auth0.
Each API in Auth0 has a unique Audience (e.g., https://bookstore-prisma-api), which the user’s token will be scoped to.

Authentication Flow:

The new user's credentials are only used to log in and obtain an access token from Auth0.
(e.g., POST /books).This ensures that your API can verify the user’s identity and permissions.

Multi-API Setup:

If you create another API in Auth0 (e.g., https://another-api), you would need a separate token scoped to that API.
The same user can log in and get tokens for multiple APIs, as long as the APIs are configured in Auth0.




      When you log in to Auth0 via Postman:

      The /login route sends these credentials to Auth0.
      Auth0 validates the credentials.
      If valid, Auth0 issues a JWT token (access token), which is required to access protected routes in your API (e.g., POST /books).

    2. Add the Token to Postman:
       - For all subsequent requests to protected routes (e.g., POST /books), include the token in the `Authorization` header.
       - Header format:
         Key: Authorization
         Value: Bearer <your-token-here>

    HOW THE AUTHENTICATION WORKS:
    1. authMiddleware:
       - Verifies the JWT token provided in the Authorization header.
       - Checks the token's validity, issuer, and audience using Auth0.
       - Blocks requests with invalid or missing tokens.

    2. getAuthToken (Server-Side Token Fetching):
       - Dynamically fetches an access token from Auth0 using the client credentials flow.
       - Used by the server for backend operations requiring Auth0 authorization.

    3. Username and Password:
       - Created in the Auth0 platform (via user registration or manually in the dashboard).
       - Required for the `/login` route to obtain the JWT token.
  */
// booksRouter.post('/', authMiddleware, async (req, res, next) => {
booksRouter.post('/', authMiddleware, async (req, res, next) => {//authmiddleware will test the user token to prove that the user has permission to perform a specific operation (like adding a new book).
  try {
    const token = await getAuthToken();// here getAuthToken will create a Token so The server can use it to communicate securely with Auth0 (e.g., for internal operations or machine-to-machine interactions).This token is generated by calling getAuthToken() using the client credentials grant type (grant_type: 'client_credentials').This server-side token is used to perform backend actions without user involvement.
    console.log('Token received:', token); // ✅ Log the token

    const { title, author, isbn, pages, available, genre } = req.body;
    console.log('Request Body:', req.body); // ✅ Log the request body

    // ✅ Call the createBook function to add the book
    const newBook = await createBook(title, author, isbn, pages, available, genre);

    // ✅ Send the new book and a success message in the response
    res.status(201).json({
      message: 'Book added successfully!', // ✅ Success message
      book: newBook, // ✅ Return the new book data
    });

    console.log('Book added successfully!'); // ✅ Log the success in the terminal
  } catch (error) {
    console.error('Error adding a new book:', error); // ✅ Log any errors
    next(error); // ✅ Pass the error to the next middleware for handling
  }
});

// Route to update a book by ID
booksRouter.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const token = await getAuthToken();
    console.log('Token received:', token); // ✅ Log the token

    const { id } = req.params; // ✅ Extract the book ID from the request parameters
    const { title, author, isbn, pages, available, genre } = req.body; // ✅ Extract the new values from the request body

    // ✅ Call the updateBookById function to update the book
    const updatedBook = updateBookById(id, title, author, isbn, pages, available, genre);

    if (!updatedBook) {
      throw new NotFoundError('Book', id); // ✅ Throw an error if the book is not found
    }

    // ✅ Send the updated book and a success message in the response
    res.status(200).json({
      message: `Book with id ${id} was updated successfully!`, // ✅ Success message
      book: updatedBook, // ✅ Return the updated book data
    });

    console.log(`Book with id ${id} was updated successfully!`); // ✅ Log the success in the terminal
  } catch (error) {
    console.error('Error updating the book:', error); // ✅ Log any errors
    next(error); // ✅ Pass the error to the next middleware for handling
  }
});

// Route to delete a book by ID
booksRouter.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const token = await getAuthToken();
    console.log('Token received:', token);

    const { id } = req.params;
    console.log('Received ID from request params:', id); // Log the received ID

    const deletedBookId = await deleteBook(id);

    if (!deletedBookId) {
      throw new NotFoundError('Book', id);
    }

    res.status(200).json({
      message: `Book with id ${deletedBookId} was deleted!`,
    });
  } catch (error) {
    next(error);
  }
});

export default booksRouter;
