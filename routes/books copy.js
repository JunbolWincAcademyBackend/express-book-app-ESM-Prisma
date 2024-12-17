import express from 'express';
import getBooks from '../services/books/getBooks.js'; // dont forget to write the correct path with ../
import getBookById from '../services/books/getBookById.js';
import createBook from '../services/books/createBook.js';
import updateBookById from '../services/books/updateBookById.js';
import deleteBook from '../services/books/deleteBook.js';
// import authMiddleware from '../middleware/auth.js';
import authMiddleware from '../middleware/advancedAuth.js';
import { getAuthToken } from '../utils/getToken.js'; // Import the token utility function

const booksRouter = express.Router(); //Create a router instance

//This is defining a route handler in your Express application, specifically for handling GET requests to the root path ('/') of this router.

booksRouter.get('/', (req, res) => {
  // next is to add the '/' route and the fetch the books data with getBooks()...res.status(200)...
  try {
    const books = getBooks(); //here we fetch the books from the database getBooks will return books which are all the books in the database
    res.status(200).json(books); //converting data array object 'books'  into JSON
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong while getting list of books!');
  }
});

//-- using GET Method to add an new route base on id:
booksRouter.get('/:id', (req, res) => {
  //id parameter in the route means that we expect an ID to be passed that will specify which book we are looking for. So :id = 1 or 2, 3 etc
  try {
    const { id } = req.params; //we extract the ID from the URL. This uses JavaScript's object destructuring feature. the params is the route endpoint: 1, 2, 3 etc and that will replace the placeholder 'id'.
    const book = getBookById(id);

    if (!book) {
      //here we check if our book was found or not with if (!book). This is a nice thing in JavaScript, as !book can mean null or undefined, which is perfect for us to check if the book was found because getBookById will return such a value if it does not exist.
      res.status(404).send(`Book with id ${id} was not found!`); //here we use the standard 404 status code if the book can not be found.
    } else {
      res.status(200).json(book);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong while getting book by id!');
  }
});

//-- using POST Method to add an new book to the database with an new id added:
booksRouter.post('/', authMiddleware, (req, res) => {
  try {
    const { title, author, isbn, pages, available, genre } = req.body; //req.body is the request object property that stores the JSON payload we expect the client to pass to this route. So title will be receive when we post it with Postman or manually so the rest.
    const newBook = createBook(title, author, isbn, pages, available, genre);
    res.status(201).json(newBook);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong while creating new book!');
  }
});

//-- using PUT Method to edit or change a book's title, author, etc:
booksRouter.put('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params; //to get the route of the book (book's name)
    const { title, author, isbn, pages, available, genre } = req.body; //this is to get the new JSON data that we PUT using Postman.
    const updatedBook = updateBookById(id, title, author, isbn, pages, available, genre);
    res.status(200).json(updatedBook);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong while updating book by id!');
  }
});

//-- using DELETE Method to delete a book
booksRouter.delete('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const deletedBookId = deleteBook(id);

    if (!deletedBookId) {
      res.status(404).send(`Book with id ${id} was not found!`);
    } else {
      res.status(200).json({
        message: `Book with id ${deletedBookId} was deleted!`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong while deleting book by id!');
  }
});

export default booksRouter;
