// ✅ Import recordsData using 'with' syntax for JSON file handling
import recordsData from '../../data/records.json' with { type: 'json' };

const deleteRecord = (id) => {
  // ✅ Find the index of the record with the given ID
  const index = recordsData.records.findIndex((record) => record.id === id);
  // So index will be the record with the id given. If the id is not found
  // JavaScript will return -1 which is a convention for 'not found'. 
  // So if not found, index === -1

  if (index === -1) {
    return null;
  }

  // ✅ Remove the record from the array using splice
  recordsData.records.splice(index, 1); 
  // The splice method modifies the original array by removing the specified
  // number of elements starting from the provided index = id. '1' is the 
  // deleteCount parameter that indicates exactly one element should be 
  // removed from the array, starting from the index.

  // ✅ Log confirmation of the deletion
  console.log(`Record with ID ${id} has been deleted.`);

  // ✅ Return the ID of the deleted record
  return id; // This line returns the id of the deleted record, indicating 
  // which record was successfully removed.
};

export default deleteRecord;




