//import recordsData from '../../data/records.json' assert { type: 'json' };

// Importing the necessary modules
import fs from 'fs';
import path from 'path';

// Resolving the path to the JSON file
const filePath = path.resolve('data/records.json');

const deleteRecord = (id) => {
  // Load the JSON file synchronously
  const recordsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const index = recordsData.records.findIndex((record) => record.id === id);
  // So index will be the record with the id given. If the id is not found Javascript will return -1 which is a convention for 'not found'. So if not found, index === -1

  if (index === -1) {
    return null;
  }

  recordsData.records.splice(index, 1); // The splice method modifies the original array by removing the specified number of elements starting from the provided index = id. '1' is The deleteCount parameter that indicates exactly one element should be removed from the array, starting from the index. In this case, only one record will be deleted.
  
  // Write the updated records array back to the records.json file
  fs.writeFileSync(filePath, JSON.stringify(recordsData, null, 2)); // Write the data with indentation
  
  return id; // This line returns the id of the deleted record, indicating which record was successfully removed.
};

export default deleteRecord;



