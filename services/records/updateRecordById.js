//import recordData from '../../data/records.json' assert { type: 'json' };

// Importing the necessary modules
import fs from 'fs';
import path from 'path';

// Resolving the path to the JSON file
const filePath = path.resolve('data/records.json');

// Function to update a record by its ID
const updateRecordById = (id, title, artist, year, available, genre) => {
  // Load the JSON file synchronously
  const recordData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Find the record by ID
  const record = recordData.records.find((record) => record.id === id);

  // If the record isn't found, throw an error
  if (!record) {
    throw new Error(`Record with id ${id} was not found!`);
  }

  // Update the record's fields using the nullish coalescing operator (??)
  record.title = title ?? record.title; // This ‘??’ is the Nullish Coalescing Operator. It's a handy tool that lets you pick between two values. value1 ?? value2. If value1 (the new value) is defined and not null, it will be chosen. If value1 is either undefined or null, value2 (the original) will be chosen instead.
  record.artist = artist ?? record.artist;
  record.year = year ?? record.year;
  record.available = available ?? record.available;
  record.genre = genre ?? record.genre;

  // Save the updated records back to the JSON file
  fs.writeFileSync(filePath, JSON.stringify(recordData, null, 2), 'utf8');

  // Return the updated record
  return record;
};

// Exporting the function for use in other modules
export default updateRecordById;

