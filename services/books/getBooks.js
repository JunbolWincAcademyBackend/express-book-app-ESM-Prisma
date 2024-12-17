//import booksData from '../../data/books.json' //assert { type: 'json' };

import fs from 'fs';
import path from 'path';

// Resolving the path to the JSON file
const filePath = path.resolve('data/books.json');

const getBooks = (genre, available) => {
  // Load the JSON file synchronously
  const booksData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Start with all books from the JSON data
  let books = booksData.books;

  // If a genre is specified, filter books by the given genre
  if (genre) {
    books = books.filter((book) => book.genre === genre);
  }

  // If availability is specified, filter books by their availability status
  if (available !== undefined) {
    // JSON.parse(available) converts the string to a boolean
    books = books.filter((book) => book.available === JSON.parse(available));
  }
  
  return books;
};

export default getBooks;



