import express from 'express';
import getRecords from '../services/records/getRecords.js'; // Corrected path
import getRecordById from '../services/records/getRecordById.js'; // Corrected path
import createRecord from '../services/records/createRecord.js'; // Corrected path
import updateRecordById from '../services/records/updateRecordById.js'; // Corrected path
import deleteRecord from '../services/records/deleteRecord.js'; // Corrected path
import authMiddleware from '../middleware/advancedAuth.js'; // Corrected path
import getAuthToken from '../utils/getAuthToken.js'; // Corrected path
import NotFoundError from '../errors/NotFoundError.js'; // Corrected path

// Create a router instance
const recordsRouter = express.Router();

// Route to get all records, with query parameter filtering
recordsRouter.get('/', (req, res, next) => {
  try {
    const { artist, genre, available } = req.query;
    const records = getRecords(artist, genre, available);

    if (!records || records.length === 0) {
      throw new NotFoundError('Records');
    }

    res.status(200).json(records);
  } catch (error) {
    next(error);
  }
});

// Route to get a record by ID
recordsRouter.get('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const record = getRecordById(id);

    if (!record) {
      throw new NotFoundError('Record', id);
    }

    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
});

// Route to create a new record
recordsRouter.post('/', authMiddleware, async (req, res, next) => {
  try {
    const token = await getAuthToken();
    console.log('Token received:', token);

    const { title, artist, year, available, genre } = req.body;
    const newRecord = createRecord(title, artist, year, available, genre);

    res.status(201).json(newRecord);
  } catch (error) {
    next(error);
  }
});

// Route to update a record by ID
recordsRouter.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const token = await getAuthToken();
    console.log('Token received:', token);

    const { id } = req.params;
    const { title, artist, year, available, genre } = req.body;
    const updatedRecord = updateRecordById(id, title, artist, year, available, genre);

    if (!updatedRecord) {
      throw new NotFoundError('Record', id);
    }

    res.status(200).json(updatedRecord);
  } catch (error) {
    next(error);
  }
});

// Route to delete a record by ID
recordsRouter.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const token = await getAuthToken();
    console.log('Token received:', token);

    const { id } = req.params;
    const deletedRecordId = deleteRecord(id);

    if (!deletedRecordId) {
      throw new NotFoundError('Record', id);
    }

    res.status(200).json({
      message: `Record with id ${deletedRecordId} was deleted!`,
    });
  } catch (error) {
    next(error);
  }
});

export default recordsRouter;
