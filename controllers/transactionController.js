const Transaction = require('../models/transactionModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getAllTransactions = catchAsync(async (req, res, next) => {
  //BUILD QUERY
  // 1.Filtering
  const queryObj = { ...req.query };
  const excludedField = ['page', 'sort', 'limit', 'fields', 'user'];
  excludedField.forEach((el) => delete queryObj[el]);
  queryObj.user = req.user._id;
  // 2.Query Operators
  let queryString = JSON.stringify(queryObj);
  queryString = queryString.replace(
    /\b[gte|gt|lte|lt]\b/g,
    (match) => `$${match}`
  );

  let query = Transaction.find(JSON.parse(queryString));
  // 3.SORT

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  }

  // 4.Limit Fields
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  }
  query = query.select('-__v');

  // 5. Pagination
  const limit = req.query.limit * 1 || 10;
  const page = req.query.page * 1 || 1;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    const transactionCount = await Transaction.countDocuments();
    if (skip >= transactionCount) throw new AppError('Page not found', 404);
  }

  //EXECUTE QUERY
  const transctions = await query;

  //SEND QUERY
  res.status(200).json({
    status: 'success',
    data: {
      count: transctions.length,
      docs: transctions,
    },
  });
});

exports.getTransactionById = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!transaction) {
    throw new AppError(`No transaction found with id: ${req.params.id}`, 404);
  }

  return res.status(200).json({
    status: 'success',
    data: transaction,
  });
});

exports.createTransaction = catchAsync(async (req, res, next) => {
  const data = { ...req.body };
  data.user = req.user._id;
  const transaction = await Transaction.create(data);
  res.status(201).json({
    status: 'success',
    data: transaction,
  });
});

exports.updateTransaction = catchAsync(async (req, res, next) => {
  console.log(req.user, req.body);
  const transaction = await Transaction.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!transaction) {
    throw new AppError(`No transaction found with id: ${req.params.id}`, 404);
  }

  return res.status(200).json({
    status: 'success',
    data: transaction,
  });
});

exports.deleteTransaction = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!transaction) {
    throw new AppError(`No transaction found with id: ${req.params.id}`, 404);
  }

  return res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getStatsByDate = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const stats = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
        timestamp: {
          $gte: startDate * 1,
          $lte: endDate * 1,
        },
      },
    },
    {
      $group: {
        _id: '$type',
        sum: { $sum: '$amount' },
      },
    },
  ]);
  return res.status(200).json({
    status: 'success',
    data: stats,
  });
});
