import { v4 as uuid } from 'uuid';
import fs from 'fs'; // ✅ Node.js File System module to handle file reading and writing
import path from 'path'; // ✅ Path module for resolving file paths
import { fileURLToPath } from 'url'; // ✅ Helps to construct __dirname in ES modules

// ✅ Manually construct __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createBook = async (title, author, isbn, pages, available, genre) => {
  try {
    // ✅ Log the input received from the request
    console.log('Received input:', { title, author, isbn, pages, available, genre });

    // ✅ Resolve the file path for the books.json file
    const filePath = path.resolve(__dirname, '../../data/books.json');
    
    // ✅ Read the existing books data from the JSON file
    const booksData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log('Books data loaded:', booksData); // ✅ Logs existing data for debugging

    // ✅ Generate a new book object with a unique id
    const newBook = {
      id: uuid(), // ✅ Generate a new unique ID for the book
      title,
      author,
      isbn,
      pages,
      available,
      genre
    };
    console.log('New book to be added:', newBook); // ✅ Log the new book object

    // ✅ Add the new book to the array of books
    booksData.books.push(newBook);

    // ✅ Write the updated books array back to the books.json file
    fs.writeFileSync(filePath, JSON.stringify(booksData, null, 2)); // ✅ Persist changes to the file
    console.log('Book added successfully!'); // ✅ Confirm book addition

    // ✅ Return the newly created book
    return newBook;

  } catch (error) {
    // ✅ Log any errors that occur
    console.error('Error creating a new book:', error);
    throw new Error('Failed to create a new book'); // ✅ Throw an error if something goes wrong
  }
};

export default createBook;
