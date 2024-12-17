import bookData from '../../data/books.json' assert { type: 'json' }; // ESM import for the JSON file
import NotFoundError from '../../errors/NotFoundError.js'; // Importing the custom NotFoundError class

const deleteBook = (id) => {
  // Find the index of the book in the books array by its ID
  const index = bookData.books.findIndex((book) => book.id === id);

  if (index === -1) {
    // If the book is not found, throw a NotFoundError with the book's ID
    throw new NotFoundError('Book', id);
  }

  // Use splice to remove the book from the array
  bookData.books.splice(index, 1);

  // Return the ID of the deleted book
  return id;
};

export default deleteBook;







