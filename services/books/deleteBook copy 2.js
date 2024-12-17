const deleteBook = async (id) => { 
  // Dynamically import the books.json file
  // Dynamic import allows us to load a module at runtime instead of at the top of the file.
  // This is useful in cases where we want to conditionally or asynchronously load data.
  // Here, we are importing the JSON file with { assert: { type: 'json' } } to ensure
  // the module is interpreted as JSON, which is an experimental feature in Node.js.
  const bookData = await import('../../data/books.json', {
    assert: { type: 'json' },
  });

  // Accessing the books array from the dynamically imported JSON module.
  // Since the module is being imported dynamically, its default export is accessed via `bookData.default`.
  // bookData.default gives us access to the content of books.json.
  // findIndex is used to locate the book by its unique `id` property.
  const index = bookData.default.books.findIndex((book) => book.id === id);

  // If the index is -1, that means no book with the specified ID was found in the array.
  if (index === -1) {
    return null; // Book not found
  }

  // Splice is used to remove the book at the found index from the array.
  // This is an in-place mutation of the array, but note that since we're dynamically importing,
  // the JSON data is read-only, meaning this mutation will NOT persist in the file itself.
  // If you want to persist the change, you would need to manually write the modified data back to the file.
  bookData.default.books.splice(index, 1);

  // This is where you would typically update the JSON file with the changes.
  // However, dynamic imports load data as read-only, so you'd need additional logic to write the updated
  // data back to the file system (like using fs.writeFile or similar methods).
  
  // Return the ID of the deleted book to indicate success.
  return id;
};

export default deleteBook;

