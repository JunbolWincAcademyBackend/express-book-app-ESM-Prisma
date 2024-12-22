// ✅ Import recordsData using 'with' syntax for JSON file handling
import recordsData from '../../data/records.json' with { type: 'json' };

// ✅ Function to get records based on artist, genre, and availability
const getRecords = (artist, genre, available) => {
  // ✅ Start with all records from the JSON data
  let records = recordsData.records;

  // ✅ If an artist is specified, filter records by the given artist
  if (artist) {
    records = records.filter((record) => record.artist === artist);
  }

  // ✅ If a genre is specified, filter records by the given genre
  if (genre) {
    records = records.filter((record) => record.genre === genre);
  }

  // ✅ If availability is specified, filter records by their availability status
  if (available !== undefined) {
    // JSON.parse(available) converts the string to a boolean
    records = records.filter((record) => record.available === JSON.parse(available));
  }

  // ✅ so what we are doing is record.available (which transforms into true 
  // if the record is available) === true (if the available property is true in 
  // the record, after being transformed into a boolean by using JSON.parse())?

  return records; // ✅ Return the filtered records
};

export default getRecords;







