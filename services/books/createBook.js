// Import the uuid package to generate unique IDs for books
import { v4 as uuid } from 'uuid';
// Import fs/promises for file handling
import fs from 'fs/promises';

// Load and validate books.json initially
let bookData;
try {
  bookData = await import('../../data/books.json', { with: { type: 'json' } });
   // ✅ Access the default property to retrieve the actual books array
   bookData = bookData.default;//⚠️ ESM JSON import returns an object with a "default" property that contains the JSON data.
   // This step ensures we extract the actual data from the "default" property.
  console.log('Loaded book data:', bookData);
} catch (error) {
  console.error('Error loading books.json:', error);
  throw new Error('Failed to load books data.');
}
// Check if 'bookData' is undefined, null, or not initialized properly
// OR if 'bookData.books' is not an array (meaning the structure is incorrect or missing).
//This ensures that your program doesn't proceed with invalid or incomplete data, which could cause runtime errors when attempting to manipulate bookData.books. It's a safety check to ensure the JSON file's structure is as expected.
if (!bookData || !Array.isArray(bookData.books)) {
  console.error('Error: books.json is missing the "books" array or is improperly formatted.');
  throw new Error('Books data is not properly initialized.');
}

// Function to save updated books data to the file
const saveBooks = async () => {
  try {
    await fs.writeFile(
      new URL('../../data/books.json', import.meta.url),
      JSON.stringify(bookData, null, 2) // Pretty-print the JSON
    );
    console.log('Book data successfully saved to file!'); // ✅ Confirm save
  } catch (error) {
    console.error('Error writing to books.json:', error);
    throw new Error('Failed to save book to file.');
  }
};

// Define the function to create a new book
const createBook = async (title, author, isbn, pages, available, genre) => {
  // ✅ Generate a new book object with a unique ID
  const newBook = {
    id: uuid(), // ✅ Generate a new unique ID for the book
    title,
    author,
    isbn,
    pages,
    available,
    genre,
  };

  console.log('New book to be added:', newBook); // ✅ Log the new book object

  // ✅ Add the new book to the array of books
  bookData.books.push(newBook);

  // Save the updated book data
  await saveBooks();

  // ✅ Return the newly created book
  return newBook;
};

export default createBook;

