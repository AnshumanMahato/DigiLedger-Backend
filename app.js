const path = require('path');
const express = require('express');
const Transaction = require('./models/transactionModel');
const catchAsync = require('./utils/catchAsync');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app
  .route('/api/v1/transaction')
  .get(
    catchAsync(async (req, res, next) => {
      const transctions = await Transaction.find();
      res.status(200).json({
        status: 'success',
        data: {
          count: transctions.length,
          docs: transctions,
        },
      });
    })
  )
  .post(
    catchAsync(async (req, res, next) => {
      const transaction = await Transaction.create(req.body);
      res.status(201).json({
        status: 'success',
        data: transaction,
      });
    })
  );

module.exports = app;
