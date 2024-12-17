//import recordsData from '../../data/records.json' assert { type: 'json' };

// Importing the necessary modules
import fs from 'fs';
import path from 'path';

// Resolving the path to the JSON file
const filePath = path.resolve('data/records.json');

// Function to get records based on artist, genre, and availability
const getRecords = (artist, genre, available) => {
  // Load the JSON file synchronously
  const recordsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Start with all records from the JSON data
  let records = recordsData.records;

  // If an artist is specified, filter records by the given artist
  if (artist) {
    records = records.filter((record) => record.artist === artist);
  }

  // If a genre is specified, filter records by the given genre
  if (genre) {
    records = records.filter((record) => record.genre === genre);
  }

  // If availability is specified, filter records by their availability status
  if (available !== undefined) {
    // JSON.parse(available) converts the string to a boolean
    records = records.filter((record) => record.available === JSON.parse(available));
  }

  // so what we are doing is record.available (which transforms into true if the record is available) === true (if the available property is true in the record, after being transformed into a boolean by using JSON.parse())?

  return records;
};

export default getRecords;






