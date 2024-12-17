import fs from 'fs'; // ✅ Node.js File System module to handle file reading and writing
import path from 'path'; // ✅ Path module for resolving file paths

const deleteBook = (id) => { 
  // ✅ Resolve the file path to the books.json file
  // Path resolution ensures that we're targeting the correct file location in the project.
    // ✅ Log the book ID being passed to the function
    console.log('Book ID to delete:', id);
    
  const filePath = path.resolve('data/books.json');

  // ✅ Read the content of the books.json file synchronously
  // The readFileSync function reads the file at the specified filePath, and utf8 encoding ensures that we are interpreting the content as a string.
  const booksData = JSON.parse(fs.readFileSync(filePath, 'utf8')); // Parse the JSON string into a JavaScript object
  console.log('Books data loaded:', booksData);

  // ✅ Find the index of the book by its ID in the array
  // The findIndex method searches for a book that matches the provided ID and returns its index.
  // If the book is not found, findIndex will return -1, indicating that no match was found.
  const index = booksData.books.findIndex((book) => book.id === String(id));

    // ✅ Log the index to verify if the book with the given ID is found
    console.log('Index of the book to delete:', index);



  // ✅ If the index is -1, that means no book with the specified ID was found in the array
  if (index === -1) {
    return null; // Book not found, return null to signal failure
  }

  // ✅ If the book is found, remove it from the books array using splice
  // The splice method removes one book at the index location.
  // This modifies the original array in place, but this only affects the in-memory version of the array.
  booksData.books.splice(index, 1); // Remove the book from the array

  // ✅ Write the updated books array back to the books.json file
  // fs.writeFileSync is used to overwrite the file with the updated content, ensuring that the deletion is saved.
  // The null, 2 arguments ensure the JSON is nicely formatted with 2-space indentation for readability.
  fs.writeFileSync(filePath, JSON.stringify(booksData, null, 2));

  // ✅ Return the ID of the deleted book to indicate success
  // Returning the ID confirms that the deletion process was successful.
  return id;
};

export default deleteBook;

