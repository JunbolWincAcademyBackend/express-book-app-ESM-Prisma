//import recordsData from '../../data/records.json' assert { type: "json" };

// Importing the necessary modules
import fs from 'fs';
import path from 'path';

// Resolving the path to the JSON file
const filePath = path.resolve('data/books.json');

const getBookById = (id) => {
  // Load the JSON file synchronously
  const booksData = JSON.parse(fs.readFileSync(filePath, 'utf8'));//This line is fetching the entire books dataset from the books.json file by reading it from the disk using Node.js's fs (filesystem) module. Here, the data is fetched synchronously (in real applications, this could be asynchronous).

  // Find and return the record with the specified ID
  return booksData.books.find((book) => book.id === id);//After fetching all the books, this line is fetching the specific book with the matching id by using JavaScript's find method.
};

export default getBookById;

