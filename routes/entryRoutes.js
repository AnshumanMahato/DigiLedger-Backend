const express = require('express');
const entryController = require('../controllers/entryController');

const router = express.Router();

router
  .route('/')
  .get(entryController.getAllEntries)
  .post(entryController.createEntry);

router
  .route('/:id')
  .get(entryController.getEntry)
  .patch(entryController.updateEntry)
  .delete(entryController.deleteEntry);

module.exports = router;
