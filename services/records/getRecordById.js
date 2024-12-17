//import recordsData from '../../data/records.json' assert { type: "json" };

// Importing the necessary modules
import fs from 'fs';
import path from 'path';

// Resolving the path to the JSON file
const filePath = path.resolve('data/records.json');

const getRecordById = (id) => {
  // Load the JSON file synchronously
  const recordsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Find and return the record with the specified ID
  return recordsData.records.find((record) => record.id === id);
};

export default getRecordById;

