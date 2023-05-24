const Book = require('../models/bookModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllBooks = catchAsync(async (req, res, next) => {
  const books = await Book.find();
  res.status(200).json({
    status: 'success',
    data: {
      count: books.length,
      docs: books,
    },
  });
});

exports.getBookByID = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const transaction = await Book.findById(id);
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
