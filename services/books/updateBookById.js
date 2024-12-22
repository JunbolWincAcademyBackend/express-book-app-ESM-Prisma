// ✅ Import booksData using 'with' syntax for JSON file handling
import booksData from '../../data/books.json' with { type: 'json' };

const updateBookById = (id, title, author, isbn, pages, available, genre) => {
  // ✅ Find the book with the specified ID
  const book = booksData.books.find((book) => book.id === id);

  if (!book) {
    throw new Error(`Book with id ${id} was not found!`);
  }

  // ✅ Update the book's properties using the Nullish Coalescing Operator
  book.title = title ?? book.title;
  book.author = author ?? book.author;
  book.isbn = isbn ?? book.isbn;
  book.pages = pages ?? book.pages;
  book.available = available ?? book.available;
  book.genre = genre ?? book.genre;

  // ✅ Log confirmation of the updated book
  console.log('Updated book:', book);

  // ✅ Return the updated book object
  return book;
};

export default updateBookById;




