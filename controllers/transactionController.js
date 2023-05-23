const Transaction = require('../models/transactionModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllTransactions = catchAsync(async (req, res, next) => {
  const transctions = await Transaction.find();
  res.status(200).json({
    status: 'success',
    data: {
      count: transctions.length,
      docs: transctions,
    },
  });
});

exports.getTransactionById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const transaction = await Transaction.findById(id);
  if (transaction)
    return res.status(200).json({
      status: 'success',
      data: transaction,
    });
  return res.status(404).json({
    status: 'not found',
    messege: 'No transactions match the given id',
  });
});

exports.createTransaction = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.create(req.body);
  res.status(201).json({
    status: 'success',
    data: transaction,
  });
});

exports.updateTransaction = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const transaction = await Transaction.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (transaction)
    return res.status(200).json({
      status: 'success',
      data: transaction,
    });
  return res.status(404).json({
    status: 'not found',
    messege: 'No transactions match the given id',
  });
});

exports.deleteTransaction = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const transaction = await Transaction.findByIdAndDelete(id);
  if (transaction)
    return res.status(204).json({
      status: 'success',
      data: null,
    });
  return res.status(404).json({
    status: 'not found',
    messege: 'No transactions match the given id',
  });
});
