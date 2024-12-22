// ✅ Import recordsData using 'with' syntax for JSON file handling
import recordsData from '../../data/records.json' with { type: 'json' };

const getRecordById = (id) => {
  // ✅ Find and return the record with the specified ID
  return recordsData.records.find((record) => record.id === id);
};

export default getRecordById;


