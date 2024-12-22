// ✅ Import recordsData using 'with' syntax for JSON file handling
import recordsData from '../../data/records.json' with { type: 'json' };
import { v4 as uuid } from 'uuid';

const createRecord = (title, artist, year, available, genre) => {
  // ✅ Generate a new record object with a unique ID
  const newRecord = {
    id: uuid(), // ✅ Generate a unique ID
    title,
    artist, // ✅ Use artist instead of author
    year,   // ✅ Use year instead of isbn
    available,
    genre,
  };

  // ✅ Add the new record to the array
  recordsData.records.push(newRecord);

  // ✅ Log confirmation of the new record
  console.log('New record created:', newRecord);

  // ✅ Return the newly created record
  return newRecord;
};

export default createRecord;




