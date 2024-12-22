// Import booksData using 'with' syntax for JSON file handling
import booksData from '../../data/books.json' with { type: 'json' };

import getAuthToken from '../utils/getAuthToken.js';

async function updateBook(bookId, updatedBookData) {
  try {
    const token = await getAuthToken(); // Request a new token
    console.log('Token received:', token); // Log the token (optional)

    // ✅ Find the index of the book to be updated
    const bookIndex = booksData.books.findIndex((book) => book.id === bookId);

    if (bookIndex === -1) {
      throw new Error(`Book with id ${bookId} not found`);
    }

    // ✅ Create the updated book object
    const updatedBook = {
      id: bookId,
      ...updatedBookData,
    };

    booksData.books[bookIndex] = updatedBook; // ✅ Update the book in the books array

    console.log('Book updated:', updatedBook); // ✅ Log the updated book
  } catch (error) {
    console.error('Error updating the book:', error);
  }
}

// Example usage: update the book with new data
const bookId = '6f37f0ae-37d5-48f2-8ae9-dbc5a59b47db'; // Replace with the actual book ID
const updatedBookData = {
  title: 'The Hobbit', // Modify as needed
  author: 'J.R.R. Tolkien', // Modify as needed
  isbn: '9780547928227', // Modify as needed
  pages: 310, // Modify as needed
  available: false, // Modify as needed (true or false)
  genre: 'Fantasy', // Modify as needed
};

updateBook(bookId, updatedBookData);
