// Importing the necessary modules
import booksData from '../../data/books.json' with { type: 'json' };

const getBookById = (id) => {
  // ✅ This line is fetching the entire books dataset from the books.json file.
  // The data is fetched directly using dynamic import with 'with' syntax.
  console.log('Books data loaded:', booksData);

  // ✅ Find and return the record with the specified ID
  return booksData.books.find((book) => book.id === id); 
  // After fetching all the books, this line is fetching the specific book
  // with the matching id by using JavaScript's find method.
};

export default getBookById;

