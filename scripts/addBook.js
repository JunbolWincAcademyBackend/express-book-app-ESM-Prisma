// addBook.js
import getAuthToken from '../utils/getAuthToken.js'; // Adjust the path if needed
import createBook from '../services/books/createBook.js'; // Adjust the path if needed
import { v4 as uuid } from 'uuid'; // ✅ Import uuid to generate unique IDs

async function addBook() {
  try {
    const token = await getAuthToken(); // Request a new token
    console.log('Token received:', token); // Log the token (optional)

    // Define the new book you want to add
    const newBook = {
      id: uuid(),
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      isbn: '9780547928227',
      pages: 310,
      available: true,
      genre: 'Fantasy',
    };

    // Call the createBook function to add the book to the database
    const createdBook = createBook(
      newBook.title,
      newBook.author,
      newBook.isbn,
      newBook.pages,
      newBook.available,
      newBook.genre
    );

    console.log('Book added:', createdBook); // Log the newly created book
  } catch (error) {
    console.error('Error adding the book:', error);
  }
}

addBook(); // Call the function to add the book
