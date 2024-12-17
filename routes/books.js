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
    const books = getBooks();
    res.status(200).json(books);
  } catch (error) {
    next(error);
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
booksRouter.post('/', authMiddleware, async (req, res, next) => {
  try {
    const token = await getAuthToken();
    console.log('Token received:', token); // ✅ Log the token

    const { title, author, isbn, pages, available, genre } = req.body;
    console.log('Request Body:', req.body); // ✅ Log the request body

    // ✅ Call the createBook function to add the book
    const newBook = await createBook(title, author, isbn, pages, available, genre);
    
    // ✅ Send the new book and a success message in the response
    res.status(201).json({
      message: 'Book added successfully!',  // ✅ Success message
      book: newBook                         // ✅ Return the new book data
    });

    console.log('Book added successfully!'); // ✅ Log the success in the terminal

  } catch (error) {
    console.error('Error adding a new book:', error); // ✅ Log any errors
    next(error); // ✅ Pass the error to the next middleware for handling
  }
});


// Route to update a book by ID
// Route to update a book by ID
booksRouter.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const token = await getAuthToken();
    console.log('Token received:', token);  // ✅ Log the token

    const { id } = req.params; // ✅ Extract the book ID from the request parameters
    const { title, author, isbn, pages, available, genre } = req.body; // ✅ Extract the new values from the request body

    // ✅ Call the updateBookById function to update the book
    const updatedBook = updateBookById(id, title, author, isbn, pages, available, genre);

    if (!updatedBook) {
      throw new NotFoundError('Book', id); // ✅ Throw an error if the book is not found
    }

    // ✅ Send the updated book and a success message in the response
    res.status(200).json({
      message: `Book with id ${id} was updated successfully!`,  // ✅ Success message
      book: updatedBook  // ✅ Return the updated book data
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
