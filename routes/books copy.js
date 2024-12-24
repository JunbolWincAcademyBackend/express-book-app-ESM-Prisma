import express from 'express';
import getBooks from '../services/books/getBooks.js'; // Corrected path
import getBookById from '../services/books/getBookById-bkup.js'; // Corrected path
import createBook from '../services/books/createBook.js'; // Corrected path
import updateBookById from '../services/books/updateBookById-bkup.js'; // Corrected path
import deleteBook from '../services/books/deleteBook.js'; // Corrected path
import authMiddleware from '../middleware/advancedAuth.js'; // Corrected path
import getAuthToken from '../utils/getAuthToken.js'; // Corrected path
import NotFoundError from '../errors/NotFoundError.js'; // Corrected path

const booksRouter = express.Router();

// Route to get all books
booksRouter.get('/', async (req, res, next) => {
  //here you need to add the async keyword. Since getBookById now returns a Promise, the route handler must also await the function call to ensure it gets the resolved book object.
  try {
    console.log('Fetching books...'); // ✅ Log request
    const { genre, available } = req.query; // Extract query parameters
    const books = await getBooks(genre, available); // ✅🐞"await" " was missing in the async function
    res.status(200).json(books); // Send books as JSON response
  } catch (error) {
    console.error('Error fetching books:', error); // Log error
    next(error); // Pass error to middleware
  }
});

// Route to get a book by ID
booksRouter.get('/:id', async (req, res, next) => {
  // use async
  try {
    const { id } = req.params; // Extract ID from route parameters

    // Fetch the book by ID using the updated `getBookById` function
    const book = await getBookById(id); // ✅ Await the Promise here

    if (!book) {
      // Throw a custom error if the book is not found
      throw new NotFoundError('Book', id);
    }

    // Respond with the fetched book
    res.status(200).json(book);
  } catch (error) {
    console.error('Error fetching book by ID:', error);
    next(error); // Pass the error to the error-handling middleware
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

// Route to add a new book
booksRouter.post('/', authMiddleware, async (req, res, next) => {
  // `authMiddleware` ensures only authenticated users can add books
  try {
    const token = await getAuthToken(); // Token for secure server-side operations
    console.log('Token received:', token); // ✅ Log the token for debugging

    const { title, author, isbn, pages, available, genre } = req.body;
    console.log('Request Body:', req.body); // ✅ Log the request body for validation

    // 🚩 Call the createBook function to add the book to the database
    const newBook = await createBook(title, author, isbn, pages, available, genre); // Using Prisma-based `createBook`

    // 🚩 Respond with success message and the created book
    res.status(201).json({
      message: 'Book added successfully!', // Success message
      book: newBook, // Return the new book data
    });

    console.log('Book added successfully:', newBook); // ✅ Log the success
  } catch (error) {
    console.error('Error adding a new book:', error); // ✅ Log any errors
    next(error); // ✅ Pass the error to the error-handling middleware
  }
});




// Route to update a book by ID
booksRouter.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params; // Extract ID from route parameters
    const { title, author, isbn, pages, available, genre } = req.body; // Extract fields from request body

    // Call the updated `updateBookById` function
    const updatedBook = await updateBookById(id, title, author, isbn, pages, available, genre);

    // Respond with the updated book
    res.status(200).json(updatedBook);
  } catch (error) {
    console.error('Error updating book by ID:', error);
    next(error); // Pass the error to the error-handling middleware
  }
});

// Route to delete a book by ID
booksRouter.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params; // Extract the ID from route parameters
    const trimmedId = id.trim();
console.log('Trimmed ID:', trimmedId);
    console.log('Received request to delete book with ID:', id);

    const deletedBookId = await deleteBook(trimmedId);

    // If no book was found, handle it
    if (!deletedBookId) {
      return res.status(404).json({
        message: `Book with ID ${id} not found.`,
      });
    }

    // Respond with success
    res.status(200).json({
      message: `Book with ID ${deletedBookId} was successfully deleted.`,
    });
  } catch (error) {
    console.error('Error in delete route:', error.message); // Improved error logging
    res.status(500).json({ message: `Failed to delete book. ${error.message}` });
  }
});

export default booksRouter;

