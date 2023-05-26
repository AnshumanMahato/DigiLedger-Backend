const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: {
      values: ['income', 'expense'],
      message: 'Valid types are income and expense',
    },
    required: [true, 'A transaction must have a type <income | expense>'],
  },
  amount: {
    type: Number,
    required: [true, 'A transaction must have an amount'],
    min: 1,
  },
  timestamp: {
    type: Number,
    required: [true, 'A transaction must have a timestamp'],
  },
  party: {
    type: String,
    required: [true, 'A transaction must have a party.'],
  },
  description: {
    type: String,
    maxlength: [100, 'Description cannot be more than 100 characters long'],
  },
  category: {
    type: String,
    default: 'Misc',
    maxlength: [20, 'Category cannot be mor than 20 characters long'],
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
