//import booksData from '../../data/books.json' assert { type: 'json' };

import fs from 'fs';
import path from 'path';

// Resolving the path to the JSON file
const filePath = path.resolve('data/books.json');

const updateBookById = (id, title, author, isbn, pages, available, genre) => {
  // Load the JSON file synchronously
  const booksData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const book = booksData.books.find((book) => book.id === id);

  if (!book) {
    throw new Error(`Book with id ${id} was not found!`);
  }

  // Update the book's properties using the Nullish Coalescing Operator
  book.title = title ?? book.title;
  book.author = author ?? book.author;
  book.isbn = isbn ?? book.isbn;
  book.pages = pages ?? book.pages;
  book.available = available ?? book.available;
  book.genre = genre ?? book.genre;

  // Write the updated books array back to the books.json file
  fs.writeFileSync(filePath, JSON.stringify(booksData, null, 2)); // Write the data with indentation

  return book;
};

export default updateBookById;



