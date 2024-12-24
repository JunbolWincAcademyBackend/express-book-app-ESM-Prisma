// ✅ Correct path to books.json
import booksData from '../../data/books.json' with { type: 'json' };

// ✅ Function to fetch books
const getBooks = (genre, available) => {
  console.log('Loading books data from books.json...');
  let books = booksData.books; // ✅ Start with all books
  console.log('Initial books data:', books);

  // ✅ Filter by genre if specified
  if (genre) {
    books = books.filter((book) => book.genre === genre);
  }
  console.log('Books after genre filter:', books);

  // ✅ Filter by availability if specified
  if (available !== undefined) {
    try {
      books = books.filter((book) => book.available === JSON.parse(available));
    } catch (error) {
      console.error('Error parsing availability:', error);
    }
  }
  console.log('Books after availability filter:', books);

  return books; // ✅ Return filtered books
};

export default getBooks;






