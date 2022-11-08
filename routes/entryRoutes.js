const express = require('express');
const entryController = require('../controllers/entryController');

const router = express.Router();

router
  .route('/')
  .get(entryController.getAllEntries)
  .post(entryController.createEntry);

router
  .route('/:id')
  .get(entryController.getbook)
  .patch(entryController.updateBook)
  .delete(entryController.deleteBook);

module.exports = router;
