const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: {
      values: ['income', 'expense'],
      message: 'Valid types are income and expense',
    },
    required: [true, 'A transaction must have a type <income | expense>'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'A transaction must have an amount'],
    min: [1, 'Transaction must have a posituve amount'],
  },
  timestamp: {
    type: Number,
    required: [true, 'A transaction must have a timestamp'],
    validate: {
      validator: function (val) {
        return val < Date.now();
      },
      message: `You cannot add future transactions.`,
    },
  },
  party: {
    type: String,
    required: [true, 'A transaction must have a party.'],
    trim: true,
  },
  description: {
    type: String,
    maxlength: [100, 'Description cannot be more than 100 characters long'],
    trim: true,
  },
  category: {
    type: String,
    default: 'Misc',
    maxlength: [20, 'Category cannot be more than 20 characters long'],
    trim: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Transaction must be associated with a user'],
    immutable: [true, 'User cannot be changed for a transaction'],
    select: false,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
