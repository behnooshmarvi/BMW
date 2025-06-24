const express = require('express');
const router = express.Router();
const { getAllRecords, getRecordById, deleteRecord, searchRecords, filterRecords} = require('../controllers/recordController');


// Search 
router.get('/search', searchRecords); 

// Filter
router.get('/filter', filterRecords);

// Other routes
router.get('/', getAllRecords);
router.get('/:id', getRecordById);
router.delete('/:id', deleteRecord);

module.exports = router;
