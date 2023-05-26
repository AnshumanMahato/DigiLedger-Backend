const express = require('express');
const transactionController = require('../controllers/transactionController');

const router = express.Router();

router.get('/stats', transactionController.getStatsByDate);
router
  .route('/')
  .get(transactionController.getAllTransactions)
  .post(transactionController.createTransaction);

router
  .route('/:id')
  .get(transactionController.getTransactionById)
  .patch(transactionController.updateTransaction)
  .delete(transactionController.deleteTransaction);

module.exports = router;
