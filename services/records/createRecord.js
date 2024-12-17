//import recordsData from '../../data/records.json' assert { type: 'json' };


import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';

// Resolving the path to the JSON file
const filePath = path.resolve('data/records.json');

const createRecord = (title, artist, year, available, genre) => {
  // Load the JSON file synchronously
  const recordsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const newRecord = {
    id: uuid(), // Generate a unique ID
    title,
    artist, // Use artist instead of author
    year, // Use year instead of isbn
    available,
    genre,
  };

  recordsData.records.push(newRecord); // Add the new record to the array

  // Write the updated records array back to the records.json file
  fs.writeFileSync(filePath, JSON.stringify(recordsData, null, 2)); // Write the data with indentation
  
  return newRecord; // Return the newly created record
};

export default createRecord;




