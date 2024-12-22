// ✅ Import booksData using 'with' syntax for JSON file handling
import booksData from '../../data/books.json' with { type: 'json' };

const deleteBook = (id) => {
  // ✅ Log the book ID being passed to the function
  console.log('Book ID to delete:', id);

  // ✅ Log the loaded books data for debugging
  console.log('Books data loaded:', booksData);

  // ✅ Find the index of the book by its ID in the array
  const index = booksData.books.findIndex((book) => book.id === String(id));

  // ✅ Log the index to verify if the book with the given ID is found
  console.log('Index of the book to delete:', index);

  // ✅ If the index is -1, that means no book with the specified ID was found in the array
  if (index === -1) {
    return null; // Book not found, return null to signal failure
  }

  // ✅ If the book is found, remove it from the books array using splice
  booksData.books.splice(index, 1); // Remove the book from the array

  // ✅ Log confirmation of the successful deletion
  console.log('Book successfully deleted.');

  // ✅ Return the ID of the deleted book to indicate success
  return id;
};

export default deleteBook;
