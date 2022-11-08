const express = require('express');
const bookController = require('../controllers/bookController');
const entryRouter = require('./entryRoutes');

const router = express.Router();

router
  .route('/')
  .get(bookController.getAllBooks)
  .post(bookController.createBook);

router
  .route('/:id')
  .get(bookController.getbook)
  .patch(bookController.updateBook)
  .delete(bookController.deleteBook);

router.use('/:bookid/entry', entryRouter);

module.exports = router;
